/*
 * @Desc         : Alova.js 配置文件
 * @Autor        : ZhangYuHang
 * @Date         : 2025-08-07 14:35:12
 * @LastEditors  : Please set LastEditors
 * @LastEditTime : 2025-08-07 17:55:59
 */

import { createAlova } from 'alova'
import adapterFetch from 'alova/fetch'
import { useUserStore } from '@/store/modules/user'
import { useAppStore } from '@/store/modules/app'
import type { AlovaConfig, RequestConfig, ResponseData, ApiError } from '../interface/http'
import { $t } from '@/language'

// 默认配置
const defaultConfig: AlovaConfig = {
  baseURL: import.meta.env?.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  enableCache: true,
  cacheTime: 5 * 60 * 1000, // 5分钟
  enableRetry: true,
  retryTimes: 3,
  headers: {
    'Content-Type': 'application/json'
  }
}

// 创建 Alova 实例
export const alovaInstance = createAlova({
  baseURL: defaultConfig.baseURL,
  timeout: defaultConfig.timeout,
  requestAdapter: adapterFetch(),

  // 请求前拦截器
  beforeRequest(method) {
    // 获取配置对象
    const config = method.config as RequestConfig
    try {
      // 在拦截器执行时才获取 store 实例，避免在模块加载时调用
      const userStore = useUserStore()
      const appStore = useAppStore()
      // 设置全局加载状态
      if (config.loading !== false) {
        appStore.setLoading(true)
      }
      // 添加认证头
      if (config.auth !== false && userStore.token) {
        method.config.headers = {
          ...method.config.headers,
          Authorization: `Bearer ${userStore.token}`
        }
      }
    } catch (error) {
      // 如果 Pinia 还未初始化，跳过 store 相关操作
      console.warn('Pinia not initialized yet, skipping store operations in beforeRequest')
    }
    // 添加自定义请求头
    if (config.headers) {
      method.config.headers = {
        ...method.config.headers,
        ...config.headers
      }
    }
    // 添加请求ID
    method.config.headers = {
      ...method.config.headers,
      'X-Request-ID': generateRequestId()
    }
    console.log(`[HTTP Request] ${method.type.toUpperCase()} ${method.url}`, {
      headers: method.config.headers,
      data: method.data
    })
  },

  // 响应拦截器
  responded: {
    // 响应成功拦截
    onSuccess: async (response: Response, method) => {
      // 获取配置对象
      const config = method.config as RequestConfig
      try {
        // 在拦截器执行时才获取 store 实例
        const appStore = useAppStore()
        // 关闭全局加载状态
        if (config.loading !== false) {
          appStore.setLoading(false)
        }
      } catch (error) {
        // 如果 Pinia 还未初始化，跳过 store 相关操作
        console.warn('Pinia not initialized yet, skipping store operations in onSuccess')
      }
      const data = (await response.json()) as ResponseData
      console.log(`[HTTP Response] ${method.type.toUpperCase()} ${method.url}`, {
        status: response.status,
        data
      })
      // 检查业务状态码（仅当响应包含 code 字段时）
      if (data.code !== undefined && data.code !== 200 && data.code !== 0) {
        const error: ApiError = {
          code: data.code,
          message: data.message || $t('请求失败，请联系管理员'),
          url: method.url,
          method: method.type.toUpperCase() as any,
          timestamp: Date.now()
        }
        // 处理特殊错误码
        handleSpecialErrorCode(error)
        // 显示错误提示
        if (config.showError !== false) {
          showErrorMessage(config.errorMessage || error.message)
        }
        throw error
      }
      // 显示成功提示
      if (config.showSuccess && config.successMessage) {
        showSuccessMessage(config.successMessage)
      }
      return data
    },

    // 响应错误拦截
    onError: (error, method) => {
      // 获取配置对象
      const config = method.config as RequestConfig

      try {
        // 在拦截器执行时才获取 store 实例
        const appStore = useAppStore()
        // 关闭全局加载状态
        if (config.loading !== false) {
          appStore.setLoading(false)
        }
      } catch (storeError) {
        // 如果 Pinia 还未初始化，跳过 store 相关操作
        console.warn('Pinia not initialized yet, skipping store operations in onError')
      }
      console.error(`[HTTP Error] ${method.type.toUpperCase()} ${method.url}`, error)
      const apiError: ApiError = {
        code: error.status || 500,
        message: getErrorMessage(error),
        url: method.url,
        method: method.type.toUpperCase() as any,
        timestamp: Date.now(),
        details: error
      }
      // 处理网络错误
      handleNetworkError(apiError)
      // 显示错误提示
      if (config.showError !== false) {
        showErrorMessage(config.errorMessage || apiError.message)
      }
      throw apiError
    }
  }
})

// 生成请求ID
const generateRequestId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// 处理特殊错误码
const handleSpecialErrorCode = (error: ApiError) => {
  try {
    const userStore = useUserStore()
    switch (error.code) {
      case 401:
        // 未授权，清除用户信息并跳转到登录页
        userStore.logout()
        // 这里可以添加路由跳转逻辑
        break
      case 403:
        // 权限不足
        console.warn('权限不足:', error.message)
        break
      case 404:
        // 资源不存在
        console.warn('资源不存在:', error.message)
        break
      case 500:
        // 服务器错误
        console.error('服务器错误:', error.message)
        break
    }
  } catch (storeError) {
    // 如果 Pinia 还未初始化，跳过 store 相关操作
    console.warn('Pinia not initialized yet, skipping store operations in handleSpecialErrorCode')
    // 仍然处理非 store 相关的错误码
    switch (error.code) {
      case 403:
        console.warn('权限不足:', error.message)
        break
      case 404:
        console.warn('资源不存在:', error.message)
        break
      case 500:
        console.error('服务器错误:', error.message)
        break
    }
  }
}

// 处理网络错误
const handleNetworkError = (error: ApiError) => {
  if (error.code === 0 || !navigator.onLine) {
    error.message = '网络连接失败，请检查网络设置'
  } else if (error.code >= 500) {
    error.message = '服务器错误，请稍后重试'
  } else if (error.code >= 400) {
    error.message = error.message || '请求错误'
  }
}

// 获取错误消息
const getErrorMessage = (error: any): string => {
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
const showSuccessMessage = (message: string) => {
  // 使用全局的消息提示组件
  if (typeof window !== 'undefined' && (window as any).$message) {
    ;(window as any).$message.success(message)
  } else {
    console.log('[Success]', message)
  }
}

// 显示错误消息
const showErrorMessage = (message: string) => {
  // 使用全局的消息提示组件
  if (typeof window !== 'undefined' && (window as any).$message) {
    ;(window as any).$message.error(message)
  } else {
    console.error('[Error]', message)
  }
}

export default alovaInstance
