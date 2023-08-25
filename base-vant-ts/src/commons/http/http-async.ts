import { httpRequestConfig, ApiResponse } from './types'
import { CapacitorHttp, HttpResponse } from '@capacitor/core'
import { API as configApi } from '@/conf/index'
import { showToast } from 'vant'
import { userCommonStoreHook } from '@/stores/modules/common'

// 获取接口根路径
const isProd = import.meta.env.MODE === 'production'
const BASE_PATH: any = isProd ? configApi.production : configApi.development
// 获取接口地址
const BASE_URL: any = import.meta.env.VITE_APP_HBJT_BASE_URL
import * as qs from 'querystring'

class Request {
  // CapacitorHttp 实例
  public instance: any
  // 基础配置
  private baseConfig: httpRequestConfig = {
    // baseURL: this.baseUrl['DEFAULT'],
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/json; charset=UTF-8'
    },
    timeout: 1000 * 60 // 设置超时时间
  }
  constructor() {
    this.instance = CapacitorHttp
  }

  // 请求拦截器
  private async interceptorsRequest(options: httpRequestConfig) {
    // 设置基础配置
    options = Object.assign(this.baseConfig, options)
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
    let ajaxPath = BASE_PATH[options.apiType || 'defaultAjaxPath']
    if (ajaxPath && !url.startsWith('http') && !url.startsWith('https')) {
      options.url = BASE_URL + ajaxPath + url
    }
    return options
  }

  // 响应拦截器
  private async interceptorsResponse(response: HttpResponse) {
    let data = JSON.parse(response.data)
    return data
  }

  // 定义请求方法
  public async request(config: httpRequestConfig): Promise<any> {
    try {
      // 请求拦截
      config = await this.interceptorsRequest(config)
      const response = await this.instance.request(config)
      // 响应拦截
      const data = await this.interceptorsResponse(response)
      return data
    } catch (error: any) {
      if (error.response) {
        const data = error.response.data
        const status = error.response.status
        let errMessage = data.message || '服务忙，请稍后重试(error)'
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
            errMessage = '服务器错误(500)'
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
            errMessage = `连接出错(${error.response.status})!`
        }
        showToast(`${errMessage}，请检查网络或联系管理员！`)
      } else {
        // 默认放一个空对象避免其他地方报错
        error.response = {}
        console.error(
          (error.config && error.config.url) || '无url',
          '请求接口超过一分钟无响应'
        )
        const msg = userCommonStoreHook().networkState
          ? '您与服务器的连接已经断开，请联系管理员处理'
          : '网络连接已断开'
        showToast(msg)
      }
      return Promise.reject(error)
    }
  }

  public get<T = any>(config?: httpRequestConfig): Promise<ApiResponse<T>> {
    return this.request(Object.assign({ method: 'get' }, config))
  }

  public post<T = any>(config?: httpRequestConfig): Promise<ApiResponse<T>> {
    return this.request(Object.assign({ method: 'post' }, config))
  }

  public put<T = any>(config?: httpRequestConfig): Promise<ApiResponse<T>> {
    return this.request(Object.assign({ method: 'put' }, config))
  }

  public delete<T = any>(config?: httpRequestConfig): Promise<ApiResponse<T>> {
    return this.request(Object.assign({ method: 'delete' }, config))
  }
}

// 默认导出Request实例
export default new Request()
