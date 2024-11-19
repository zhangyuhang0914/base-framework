import { message as Message } from 'antd'
import axios, { AxiosRequestConfig, AxiosError, AxiosResponse } from 'axios'
import { t } from '@/locales/i18n'
import { Result } from '@/types/api'
import { ResultEnum } from '@/types/enum'

// 创建 axios 实例
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API as string, // api 的 base_url
  timeout: 60 * 1000, // 请求超时时间 60s
  headers: { 'Content-Type': 'application/json;charset=utf-8' }
})

// 请求拦截
axiosInstance.interceptors.request.use(
  config => {
    // 在请求被发送之前做些什么
    config.headers.Authorization = 'Bearer Token'
    return config
  },
  error => {
    // 请求错误时做些什么
    return Promise.reject(error)
  }
)

// 响应拦截
axiosInstance.interceptors.response.use(
  (res: AxiosResponse<Result>) => {
    if (!res.data) throw new Error(t('sys.api.apiRequestFailed'))

    const { status, data, message } = res.data
    // 业务请求成功
    const hasSuccess = data && Reflect.has(res.data, 'status') && status === ResultEnum.SUCCESS
    if (hasSuccess) {
      return data
    }

    // 业务请求错误
    throw new Error(message || t('sys.api.apiRequestFailed'))
  },
  (error: AxiosError<Result>) => {
    const { response, message } = error || {}
    let errMsg = ''
    try {
      errMsg = response?.data?.message || message
    } catch (error) {
      throw new Error(error as unknown as string)
    }
    Message.error(errMsg)
    return Promise.reject(error)
  }
)

class APIClient {
  get<T = any>(config: AxiosRequestConfig): Promise<T> {
    return this.request({ ...config, method: 'GET' })
  }

  post<T = any>(config: AxiosRequestConfig): Promise<T> {
    return this.request({ ...config, method: 'POST' })
  }

  put<T = any>(config: AxiosRequestConfig): Promise<T> {
    return this.request({ ...config, method: 'PUT' })
  }

  delete<T = any>(config: AxiosRequestConfig): Promise<T> {
    return this.request({ ...config, method: 'DELETE' })
  }

  request<T = any>(config: AxiosRequestConfig): Promise<T> {
    return new Promise((resolve, reject) => {
      axiosInstance
        .request<any, AxiosResponse<Result>>(config)
        .then((res: AxiosResponse<Result>) => {
          resolve(res as unknown as Promise<T>)
        })
        .catch((e: Error | AxiosError) => {
          reject(e)
        })
    })
  }
}
export default new APIClient()
