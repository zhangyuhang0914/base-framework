import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse, AxiosError, type InternalAxiosRequestConfig } from 'axios'
import type { httpRequestConfig, ApiResponse } from './types'
import { $message } from '@/plugins/element'
import { API as configApi } from '@/conf/index'
import { userCommonStoreHook } from '@/stores/modules/common'
import qs from 'qs'
import { getToken } from '@/utils/cookie'

// 获取接口根路径
const isProd = import.meta.env.PROD
const BASE_PATH: any = isProd ? configApi.production : configApi.development

// 导出Request类，可以用来自定义传递配置来创建实例
export class Request {
  // axios 实例
  public instance: AxiosInstance
  // 基础配置
  private baseConfig: httpRequestConfig = {
    url: BASE_PATH['BASE_URL'],
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/json; charset=UTF-8'
    },
    timeout: 1000 * 60 // 设置超时时间
  }

  constructor(options: httpRequestConfig) {
    // 创建axios实例
    this.instance = axios.create(Object.assign(this.baseConfig, options))
    this.instance.interceptors.request.use(
      (options: httpRequestConfig): InternalAxiosRequestConfig<httpRequestConfig> => {
        // 简化类型设置
        const headers = (options.headers = options.headers || {})

        if (options.isForm) {
          headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
          delete options.isForm
        }
        if (options.formUpload) {
          headers['Content-Type'] = 'multipart/form-data; charset=UTF-8'
          delete options.formUpload
        }
        // 校验post数据格式
        const contentType = headers['Content-Type']
        if (typeof options.data === 'object' && contentType && String(contentType).indexOf('application/x-www-form-urlencoded') > -1) {
          options.data = qs.stringify(options.data)
        }
        // post数据格式为form-data
        if (options.isPostAndFormData) {
          options.url += `?${qs.stringify(options.data)}`
          delete options.data
        }
        // 设置token
        if (getToken()) {
          headers['token'] = getToken() ?? ''
        }
        const url = options.url ?? ''
        if (!url.startsWith('http') && !url.startsWith('https')) {
          options.url = BASE_PATH[options.apiType || 'BASE_URL'] + options.url
        }
        return options as InternalAxiosRequestConfig<httpRequestConfig>
      },
      (error: AxiosError) => {
        // 请求错误，这里可以用全局提示框进行提示
        return Promise.reject(error)
      }
    )

    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        const options: httpRequestConfig = response.config
        const responseData = response.data
        const responseCode = responseData.code
        const responseMsg = responseData?.msg
        const responseBz = responseData?.bz
        if (responseCode === 0) {
          return Promise.resolve(responseData)
        } else if (responseCode === 500 || responseMsg === 'token不能为空') {
          // token失效，处理退出登录逻辑
          // $message('登录已失效，请重新登录！', 'error')
          // userCommonStoreHook().logout()
          this.errorMessage(responseMsg, responseBz)
          return Promise.reject(responseData)
        } else {
          this.errorMessage(responseMsg, responseBz)
          return Promise.reject(responseData)
        }
      },
      (error: any) => {
        if (error.response) {
          const status = error.response.status
          let errMessage = error.message || '服务忙，请稍后重试(error)'
          switch (status) {
            case 400:
              errMessage = '请求错误(400)'
              break
            case 401:
              errMessage = '未授权，请重新登录(401)'
              // 这里可以做清空storage并跳转到登录页的操作
              break
            case 403:
              errMessage = '拒绝访问(403)'
              break
            case 404:
              errMessage = '404 Not Found'
              break
            case 408:
              errMessage = '请求超时(408)'
              break
            case 500:
              errMessage = error.msg || '服务器错误(500)'
              break
            case 501:
              errMessage = '服务未实现(501)'
              break
            case 502:
              errMessage = '网络错误(502)'
              break
            case 503:
              errMessage = '服务不可用(503)'
              break
            case 504:
              errMessage = '网络超时(504)'
              break
            case 505:
              errMessage = 'HTTP版本不受支持(505)'
              break
            default:
              errMessage = `连接出错(${error.status})!`
          }
          $message(`${errMessage}，请检查网络或联系管理员！`, 'error')
        } else {
          // 默认放一个空对象避免其他地方报错
          error.response = {}
          console.error((error.config && error.config.url) || '无url', '请求接口超过一分钟无响应')
          const msg = userCommonStoreHook().onlineState ? '您与服务器的连接已经断开，请联系管理员处理' : '网络连接已断开'
          $message(msg, 'error')
        }
        return Promise.reject(error)
      }
    )
  }

  // 定义请求方法
  public request<T>(config: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.instance.request(config)
  }

  public get<T>(config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.instance.get(config?.url as string, config)
  }

  public post<T>(config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.instance.post(config?.url as string, config?.data, config)
  }

  public put<T>(config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.instance.put(config?.url as string, config?.data, config)
  }

  public delete<T>(config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.instance.delete(config?.url as string, config)
  }

  public errorMessage(responseMsg: string, responseBz: string) {
    if (responseMsg && typeof responseMsg === 'string') {
      $message(responseMsg, 'error')
    } else if (responseBz && typeof responseBz === 'string') {
      $message(responseBz, 'error')
    } else {
      $message(responseMsg || responseBz || '', 'error')
    }
  }
}

// 默认导出Request实例
export default new Request({})
