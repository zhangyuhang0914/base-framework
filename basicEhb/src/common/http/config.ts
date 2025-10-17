/*
 * HTTP 配置文件
 */

import { createAlova, type Method, type RequestBody } from 'alova'
import adapterFetch from 'alova/fetch'
import vueHook from 'alova/vue'
import qs from 'qs'
import type { httpRequestConfig, ApiResponse, ApiError } from '../interface/http'
import { getToken } from '@/utils/storage/cookie'
import {
  getBaseUrlByService,
  ApiServiceType,
  CURRENT_ENV,
  CURRENT_API_CONFIG
} from '@/config/apiConfig'

// 默认配置
const defaultConfig: httpRequestConfig = {
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  timeout: 1000 * 60 // 设置超时时间
}

/**
 * 服务实例缓存，避免重复创建
 */
const serviceInstances = new Map<ApiServiceType, Request>()

// 导出Request类，可以用来自定义传递配置来创建实例
export class Request {
  // alova 实例
  public instance
  // 服务类型
  public serviceType: ApiServiceType

  /**
   * 构造函数
   * @param options 请求配置
   * @param serviceType 服务类型
   */
  constructor(options: httpRequestConfig, serviceType: ApiServiceType = ApiServiceType.DEFAULT) {
    this.serviceType = serviceType
    const baseURL = getBaseUrlByService(serviceType)
    // 创建alova实例
    this.instance = createAlova({
      baseURL,
      statesHook: vueHook,
      timeout: options.timeout || defaultConfig.timeout,
      // 请求适配器，使用fetch请求适配器
      requestAdapter: adapterFetch(),
      // 请求前拦截器
      beforeRequest: this.beforeRequest.bind(this),
      // 响应拦截器
      responded: {
        onSuccess: this.onSuccess.bind(this),
        onError: this.onError.bind(this)
      }
    })
  }

  /**
   * 获取指定服务类型的Request实例（单例模式）
   * @param serviceType 服务类型
   * @param config 请求配置
   */
  static getInstance(
    serviceType: ApiServiceType = ApiServiceType.DEFAULT,
    config: httpRequestConfig
  ): Request {
    if (!serviceInstances.has(serviceType)) {
      serviceInstances.set(serviceType, new Request(config, serviceType))
    }
    return serviceInstances.get(serviceType)!
  }
  // 请求前拦截器
  private beforeRequest(method: Method) {
    // 获取配置对象
    const config = method.config as httpRequestConfig
    const headers = (method.config.headers = method.config.headers || {})
    const token = getToken()
    // token认证
    if (config.auth !== false && token) {
      headers['token'] = token
    }
    // 处理表单相关配置
    if (config.isForm) {
      headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
    }
    if (config.formUpload) {
      headers['Content-Type'] = 'multipart/form-data; charset=UTF-8'
    }
    // console.log('beforeRequest', method, config, config.url)
    // 校验post数据格式
    const contentType = headers['Content-Type']
    if (
      method.type.toUpperCase() === 'POST' &&
      typeof method.data === 'object' &&
      contentType &&
      String(contentType).indexOf('application/x-www-form-urlencoded') > -1
    ) {
      method.data = qs.stringify(method.data)
    }
    // post数据格式为form-data
    if (config.isPostAndFormData) {
      method.url += `?${qs.stringify(method.data)}`
      delete method.data
    }
    // 添加请求ID
    headers['X-Request-ID'] = this.generateRequestId()
    console.log(`[HTTP Request] ${method.type.toUpperCase()} ${method.url}`, config)
  }
  // 响应成功拦截
  private async onSuccess<T>(response: Response, method: Method) {
    // 获取配置对象
    const config: httpRequestConfig = method.config
    // 全局加载状态功能已移除
    const data: ApiResponse<T> = await response.json()
    // console.log(`[HTTP Response] ${method.type.toUpperCase()} ${method.url}`, {
    //   status: response.status,
    //   data
    // })
    // 检查业务状态码（仅当响应包含 code 字段时）
    if (data.code !== undefined && data.code !== 200 && data.code !== 0) {
      const error: ApiError = {
        code: data.code,
        message: data.message || '请求失败，请联系管理员',
        url: method.url,
        method: method.type.toUpperCase() as any,
        timestamp: Date.now()
      }
      // 处理特殊错误码
      this.handleSpecialErrorCode(error)
      // 显示错误提示
      if (config.errorMessage) {
        this.showErrorMessage(config.errorMessage || error.message)
      }
      throw error
    }
    // 显示成功提示
    if (config.successMessage) {
      this.showSuccessMessage(config.successMessage)
    }
    return data
  }
  // 响应错误拦截
  private onError(error: any, method: Method) {
    // 获取配置对象
    const config = method.config as httpRequestConfig
    console.error(`[HTTP Error] ${method.type.toUpperCase()} ${method.url}`, error)
    const apiError: ApiError = {
      code: error?.status || 500,
      message: this.getErrorMessage(error),
      url: method.url,
      method: method.type.toUpperCase() as any,
      timestamp: Date.now(),
      details: error
    }
    // 处理网络错误
    this.handleNetworkError(apiError)
    // 显示错误提示
    if (config.errorMessage) {
      this.showErrorMessage(config.errorMessage || apiError.message)
    }
    throw apiError
  }
  // 生成请求ID
  private generateRequestId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }
  // 处理特殊错误码
  private handleSpecialErrorCode(error: ApiError) {
    try {
      switch (error.code) {
        case 401:
        case 500:
          // token失效，处理退出登录逻辑
          '登录已失效，请重新登录！'
          break
        case 403:
          // 无访问权限
          console.warn('无访问权限:', error.message)
          break
        case 404:
          // 资源不存在
          console.warn('资源不存在:', error.message)
          break
      }
    } catch (storeError) {
      // 如果 Pinia 还未初始化，跳过 store 相关操作
      console.warn('Pinia not initialized yet, skipping store operations in handleSpecialErrorCode')
      // 仍然处理非 store 相关的错误码
      switch (error.code) {
        case 403:
          console.warn('无访问权限:', error.message)
          break
        case 404:
          console.warn('资源不存在:', error.message)
          break
      }
    }
  }
  // 处理网络错误
  private handleNetworkError(error: ApiError) {
    if (error.code === 0 || !navigator.onLine) {
      error.message = '网络连接失败，请检查网络设置'
    } else if (error.code >= 500) {
      error.message = '服务器错误，请稍后重试'
    } else if (error.code >= 400) {
      error.message = error.message || '请求错误'
    }
  }
  // 获取错误消息
  private getErrorMessage(error: any): string {
    if (error.message) {
      return error.message
    }
    switch (error.status) {
      case 400:
        return '请求参数错误'
      case 401:
        return '未授权，请重新登录'
      case 403:
        return '权限不足'
      case 404:
        return '请求的资源不存在'
      case 408:
        return '请求超时'
      case 500:
        return '服务器内部错误'
      case 502:
        return '网关错误'
      case 503:
        return '服务不可用'
      case 504:
        return '网关超时'
      default:
        return '网络错误'
    }
  }
  // 显示成功消息
  private showSuccessMessage(message: string) {
    // 使用全局的消息提示组件
    if (typeof window !== 'undefined' && (window as any).$message) {
      ;(window as any).$message.success(message)
    } else {
      console.log('[Success]', message)
    }
  }
  // 显示错误消息
  private showErrorMessage(message: string) {
    // 使用全局的消息提示组件
    if (typeof window !== 'undefined' && (window as any).$message) {
      ;(window as any).$message.error(message)
    } else {
      console.error('[Error]', message)
    }
  }
  /**
   * 将自定义配置转换为 Alova 配置
   */
  private transformConfig(config?: httpRequestConfig): any {
    if (!config) return {}
    const alovaConfig: any = {
      ...config,
      // 处理缓存配置
      ...(config.cacheFor && {
        localCache: config.cacheFor
      })
    }
    // 移除自定义属性，避免冲突
    delete alovaConfig.cacheFor
    delete alovaConfig.isForm
    delete alovaConfig.formUpload
    delete alovaConfig.isPostAndFormData
    delete alovaConfig.successMessage
    delete alovaConfig.errorMessage
    return alovaConfig
  }
  // 定义请求方法
  public request<T>(method: string, url: string, data?: RequestBody, config?: httpRequestConfig) {
    switch (method.toUpperCase()) {
      case 'GET':
        return this.get<T>(url, config)
      case 'POST':
        return this.post<T>(url, data, config)
      case 'PUT':
        return this.put<T>(url, data, config)
      case 'DELETE':
        return this.delete<T>(url, data as RequestBody, config)
      case 'PATCH':
        return this.patch<T>(url, data as RequestBody, config)
      default:
        throw new Error(`Unsupported HTTP method: ${method}`)
    }
  }
  public get<T>(url: string, config?: httpRequestConfig) {
    const alovaConfig = this.transformConfig(config)
    return this.instance.Get<ApiResponse<T>>(url, alovaConfig)
  }
  public post<T>(url: string, data?: RequestBody, config?: httpRequestConfig) {
    const alovaConfig = this.transformConfig(config)
    return this.instance.Post<ApiResponse<T>>(url, data, alovaConfig)
  }
  public put<T>(url: string, data?: RequestBody, config?: httpRequestConfig) {
    const alovaConfig = this.transformConfig(config)
    return this.instance.Put<ApiResponse<T>>(url, data, alovaConfig)
  }
  public delete<T>(url: string, data?: RequestBody, config?: httpRequestConfig) {
    const alovaConfig = this.transformConfig(config)
    return this.instance.Delete<ApiResponse<T>>(url, data, alovaConfig)
  }
  public patch<T>(url: string, data?: RequestBody, config?: httpRequestConfig) {
    const alovaConfig = this.transformConfig(config)
    return this.instance.Patch<ApiResponse<T>>(url, data, alovaConfig)
  }
}

// 默认导出默认服务类型的Request实例
export const defaultInstance = Request.getInstance(ApiServiceType.DEFAULT, defaultConfig)
export const baseInstance = Request.getInstance(ApiServiceType.BASE, defaultConfig)
export const fileInstance = Request.getInstance(ApiServiceType.FILE, defaultConfig)

// 导出服务类型枚举，方便外部使用
export { ApiServiceType, CURRENT_ENV, CURRENT_API_CONFIG }

// 默认导出默认服务实例
export default defaultInstance
