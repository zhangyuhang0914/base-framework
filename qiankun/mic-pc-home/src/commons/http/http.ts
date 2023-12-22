import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError
} from 'axios'
import { httpRequestConfig, ApiResponse } from './types'
import { $message } from '@/plugins/element'
import { API as configApi } from '@/conf/index'
import { userCommonStoreHook } from '@/stores/modules/common'
import * as qs from 'querystring'
import router from '@/routers/index'

// 获取接口根路径
const isProd = import.meta.env.PROD
const BASE_PATH: any = isProd ? configApi.production : configApi.development
// 获取接口地址
const BASE_URL: any = isProd ? process.env.VITE_APP_BASE_URL : ''
const VITE_APP_NAME: any = process.env.VITE_APP_NAME

// 导出Request类，可以用来自定义传递配置来创建实例
export class Request {
  // private baseUrl: any = BASE_PATH
  // axios 实例
  public instance: AxiosInstance
  // 基础配置
  private baseConfig: httpRequestConfig = {
    // baseURL: this.baseUrl['DEFAULT'],
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/json; charset=UTF-8'
    },
    timeout: 1000 * 60 // 设置超时时间
  }

  constructor(options: httpRequestConfig) {
    // 使用axios.create创建axios实例
    this.instance = axios.create(Object.assign(this.baseConfig, options))
    this.instance.interceptors.request.use(
      (options: httpRequestConfig) => {
        // 简化类型设置
        const headers = (options.headers = options.headers || {})

        if (options.form) {
          headers['Content-Type'] =
            'application/x-www-form-urlencoded; charset=UTF-8'
          delete options.form
        }
        if (options.formUpload) {
          headers['Content-Type'] = 'multipart/form-data; charset=UTF-8'
          delete options.formUpload
        }
        // 校验post数据格式
        const contentType = headers['Content-Type']
        if (
          typeof options.data === 'object' &&
          contentType &&
          String(contentType).indexOf('application/x-www-form-urlencoded') > -1
        ) {
          options.data = qs.stringify(options.data)
        }

        let url: any = options.url
        let ajaxPath = BASE_PATH[options.apiType || VITE_APP_NAME]
        if (ajaxPath && !url.startsWith('http') && !url.startsWith('https')) {
          options.url = BASE_URL + ajaxPath + url
        }
        return options
      },
      (error: AxiosError) => {
        // 请求错误，这里可以用全局提示框进行提示
        return Promise.reject(error)
      }
    )

    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        return response.data
      },
      (error: any) => {
        if (error.response) {
          const status = error.code
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
              // token 失效
              router.replace({
                name: 'Login'
              })
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
          console.error(
            (error.config && error.config.url) || '无url',
            '请求接口超过一分钟无响应'
          )
          const msg = userCommonStoreHook().onlineState
            ? '您与服务器的连接已经断开，请联系管理员处理'
            : '网络连接已断开'
          $message(msg, 'error')
        }
        return Promise.reject(error)
      }
    )
  }

  // 定义请求方法
  public request(config: AxiosRequestConfig): Promise<AxiosResponse> {
    return this.instance.request(config)
  }

  public get<T = any>(
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.instance.get(config?.url as string, config)
  }

  public post<T = any>(
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.instance.post(config?.url as string, config?.data, config)
  }

  public put<T = any>(
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.instance.put(config?.url as string, config?.data, config)
  }

  public delete<T = any>(
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.instance.delete(config?.url as string, config)
  }
}

// 默认导出Request实例
export default new Request({})
