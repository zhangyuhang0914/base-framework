/*
 * @Desc         : Alova.js API 封装
 * @Autor        : ZhangYuHang
 * @Date         : 2024-12-19 18:00:00
 * @LastEditors  : Please set LastEditors
 * @LastEditTime : 2025-08-07 17:28:42
 */

import alovaInstance from './config'
import type {
  RequestConfig,
  ResponseData,
  PaginationParams,
  PaginationResponse,
  UploadParams,
  UploadResponse,
  HttpMethod
} from '../interface/http'

/**
 * 通用请求方法
 * @param method HTTP 方法
 * @param url 请求地址
 * @param data 请求数据
 * @param config 请求配置
 */
export const request = <T = any>(
  method: HttpMethod,
  url: string,
  data?: any,
  config?: RequestConfig
) => {
  switch (method.toUpperCase()) {
    case 'GET':
      return get<T>(url, data, config)
    case 'POST':
      return post<T>(url, data, config)
    case 'PUT':
      return put<T>(url, data, config)
    case 'DELETE':
      return del<T>(url, config)
    case 'PATCH':
      return patch<T>(url, data, config)
    default:
      throw new Error(`Unsupported HTTP method: ${method}`)
  }
}

/**
 * GET 请求
 * @param url 请求地址
 * @param params 查询参数
 * @param config 请求配置
 */
export const get = <T = any>(url: string, params?: Record<string, any>, config?: RequestConfig) => {
  // 提取 Alova 原生配置，排除自定义属性
  const {
    loading,
    showError,
    showSuccess,
    successMessage,
    errorMessage,
    retryTimes,
    auth,
    ...alovaConfig
  } = config || {}

  return alovaInstance.Get<ResponseData<T>>(url, {
    ...alovaConfig,
    params
  } as any)
}

/**
 * POST 请求
 * @param url 请求地址
 * @param data 请求数据
 * @param config 请求配置
 */
export const post = <T = any>(url: string, data?: any, config?: RequestConfig) => {
  // 提取 Alova 原生配置，排除自定义属性
  const {
    loading,
    showError,
    showSuccess,
    successMessage,
    errorMessage,
    retryTimes,
    auth,
    ...alovaConfig
  } = config || {}

  return alovaInstance.Post<ResponseData<T>>(url, data, alovaConfig as any)
}

/**
 * PUT 请求
 * @param url 请求地址
 * @param data 请求数据
 * @param config 请求配置
 */
export const put = <T = any>(url: string, data?: any, config?: RequestConfig) => {
  // 提取 Alova 原生配置，排除自定义属性
  const {
    loading,
    showError,
    showSuccess,
    successMessage,
    errorMessage,
    retryTimes,
    auth,
    ...alovaConfig
  } = config || {}

  return alovaInstance.Put<ResponseData<T>>(url, data, alovaConfig as any)
}

/**
 * DELETE 请求
 * @param url 请求地址
 * @param config 请求配置
 */
export const del = <T = any>(url: string, config?: RequestConfig) => {
  // 提取 Alova 原生配置，排除自定义属性
  const {
    loading,
    showError,
    showSuccess,
    successMessage,
    errorMessage,
    retryTimes,
    auth,
    ...alovaConfig
  } = config || {}

  return alovaInstance.Delete<ResponseData<T>>(url, alovaConfig as any)
}

/**
 * PATCH 请求
 * @param url 请求地址
 * @param data 请求数据
 * @param config 请求配置
 */
export const patch = <T = any>(url: string, data?: any, config?: RequestConfig) => {
  // 提取 Alova 原生配置，排除自定义属性
  const {
    loading,
    showError,
    showSuccess,
    successMessage,
    errorMessage,
    retryTimes,
    auth,
    ...alovaConfig
  } = config || {}

  return alovaInstance.Patch<ResponseData<T>>(url, data, alovaConfig as any)
}

/**
 * 分页查询
 * @param url 请求地址
 * @param params 分页参数
 * @param config 请求配置
 */
export const getPage = <T = any>(url: string, params: PaginationParams, config?: RequestConfig) => {
  return get<PaginationResponse<T>>(url, params, config)
}

/**
 * 文件上传
 * @param url 上传地址
 * @param uploadParams 上传参数
 * @param config 请求配置
 */
export const upload = <T = any>(
  url: string,
  uploadParams: UploadParams,
  config?: RequestConfig
) => {
  const formData = new FormData()
  formData.append('file', uploadParams.file)
  if (uploadParams.filename) {
    formData.append('filename', uploadParams.filename)
  }
  if (uploadParams.path) {
    formData.append('path', uploadParams.path)
  }
  if (uploadParams.data) {
    Object.keys(uploadParams.data).forEach(key => {
      formData.append(key, uploadParams.data![key])
    })
  }
  return post<UploadResponse>(url, formData, {
    ...config,
    headers: {
      ...config?.headers,
      'Content-Type': 'multipart/form-data'
    }
  })
}

/**
 * 文件下载
 * @param url 下载地址
 * @param filename 文件名
 * @param config 请求配置
 */
export const download = async (url: string, filename?: string, config?: RequestConfig) => {
  // 提取 Alova 原生配置，排除自定义属性
  const {
    loading,
    showError,
    showSuccess,
    successMessage,
    errorMessage,
    retryTimes,
    auth,
    ...alovaConfig
  } = config || {}

  const response = await alovaInstance.Get(url, {
    ...alovaConfig,
    transform: (data: any) => data // 保持原始数据
  } as any)

  // 创建 Blob 对象
  let blob: Blob
  if (response instanceof Blob) {
    blob = response
  } else if (response instanceof ArrayBuffer) {
    blob = new Blob([response])
  } else {
    // 如果是其他类型，尝试转换为字符串
    blob = new Blob([JSON.stringify(response)], { type: 'application/json' })
  }

  const downloadUrl = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = downloadUrl
  link.download = filename || 'download'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(downloadUrl)
}

/**
 * 批量请求
 * @param requests 请求数组
 */
export const batch = <T = any>(requests: Array<() => Promise<ResponseData<T>>>) => {
  return Promise.all(requests.map(request => request()))
}

/**
 * 串行请求
 * @param requests 请求数组
 */
export const serial = async <T = any>(requests: Array<() => Promise<ResponseData<T>>>) => {
  const results: ResponseData<T>[] = []
  for (const request of requests) {
    const result = await request()
    results.push(result)
  }
  return results
}

/**
 * 重试请求
 * @param requestFn 请求函数
 * @param maxRetries 最大重试次数
 * @param delay 重试延迟（毫秒）
 */
export const retry = async <T = any>(
  requestFn: () => Promise<ResponseData<T>>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<ResponseData<T>> => {
  let lastError: any
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await requestFn()
    } catch (error) {
      lastError = error
      if (i < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)))
      }
    }
  }
  throw lastError
}

/**
 * 请求缓存
 * @param key 缓存键
 * @param requestFn 请求函数
 * @param ttl 缓存时间（毫秒）
 */
const cache = new Map<string, { data: any; timestamp: number; ttl: number }>()

export const cached = async <T = any>(
  key: string,
  requestFn: () => Promise<ResponseData<T>>,
  ttl: number = 5 * 60 * 1000 // 默认5分钟
): Promise<ResponseData<T>> => {
  const now = Date.now()
  const cached = cache.get(key)
  if (cached && now - cached.timestamp < cached.ttl) {
    return cached.data
  }
  const data = await requestFn()
  cache.set(key, { data, timestamp: now, ttl })
  return data
}

/**
 * 清除缓存
 * @param key 缓存键，不传则清除所有缓存
 */
export const clearCache = (key?: string) => {
  if (key) {
    cache.delete(key)
  } else {
    cache.clear()
  }
}

// 导出默认实例
export { alovaInstance }
export default {
  get,
  post,
  put,
  delete: del,
  patch,
  getPage,
  upload,
  download,
  batch,
  serial,
  retry,
  cached,
  clearCache,
  instance: alovaInstance
}
