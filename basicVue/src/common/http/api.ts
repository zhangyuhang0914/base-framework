/*
 * HTTP API 封装
 */

import { defaultInstance, baseInstance, fileInstance, ApiServiceType } from './config'
import type { httpRequestConfig, ApiResponse, HttpMethod } from '../interface/http'
import type { RequestBody } from 'alova'

/**
 * 根据apiType获取对应的服务实例
 * @param apiType API类型
 */
const getInstanceByApiType = (apiType?: string) => {
  switch (apiType) {
    case ApiServiceType.BASE:
      return baseInstance
    case ApiServiceType.FILE:
      return fileInstance
    default:
      return defaultInstance
  }
}

/**
 * 通用请求方法
 * @param method HTTP 方法
 * @param config 请求配置
 */
export const request = <T = any>(method: HttpMethod, config?: httpRequestConfig) => {
  switch (method.toUpperCase()) {
    case 'GET':
      return get<T>(config)
    case 'POST':
      return post<T>(config)
    case 'PUT':
      return put<T>(config)
    case 'DELETE':
      return del<T>(config)
    case 'PATCH':
      return patch<T>(config)
    default:
      throw new Error(`Unsupported HTTP method: ${method}`)
  }
}

// GET 请求
export const get = <T>(config?: httpRequestConfig): Promise<ApiResponse<T>> => {
  const instance = getInstanceByApiType(config?.apiType)
  return instance.get<T>(config?.url as string, config)
}
// POST 请求
export const post = <T>(config?: httpRequestConfig): Promise<ApiResponse<T>> => {
  const instance = getInstanceByApiType(config?.apiType)
  return instance.post<T>(config?.url as string, config?.data, config)
}
// PUT 请求
export const put = <T>(config?: httpRequestConfig): Promise<ApiResponse<T>> => {
  const instance = getInstanceByApiType(config?.apiType)
  return instance.put<T>(config?.url as string, config?.data, config)
}
// DELETE 请求
export const del = <T>(config?: httpRequestConfig): Promise<ApiResponse<T>> => {
  const instance = getInstanceByApiType(config?.apiType)
  return instance.delete<T>(config?.url as string, config?.data as RequestBody, config)
}
// PATCH 请求
export const patch = <T>(config?: httpRequestConfig): Promise<ApiResponse<T>> => {
  const instance = getInstanceByApiType(config?.apiType)
  return instance.patch<T>(config?.url as string, config?.data as RequestBody, config)
}

/**
 * 批量请求（异步请求）
 * @param requests 请求数组（支持函数或Promise）
 */
export const batch = <T>(requests: Array<(() => Promise<ApiResponse<T>>) | Promise<ApiResponse<T>>>): Promise<ApiResponse<T>[]> => {
  return Promise.all(requests.map(request => (typeof request === 'function' ? request() : request)))
}

/**
 * 串行请求（同步请求）
 * @param requests 请求数组（支持函数或Promise）
 */
export const serial = async <T>(requests: Array<(() => Promise<ApiResponse<T>>) | Promise<ApiResponse<T>>>): Promise<ApiResponse<T>[]> => {
  const results: ApiResponse<T>[] = []
  for (const request of requests) {
    const result = typeof request === 'function' ? await request() : await request
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
export const retry = async <T>(requestFn: () => Promise<ApiResponse<T>>, maxRetries: number = 3, delay: number = 1000): Promise<ApiResponse<T>> => {
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

export const cached = async <T>(
  key: string,
  requestFn: () => Promise<ApiResponse<T>>,
  ttl: number = 5 * 60 * 1000 // 默认5分钟
): Promise<ApiResponse<T>> => {
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
export { defaultInstance }
export default {
  get,
  post,
  put,
  delete: del,
  patch,
  batch,
  serial,
  retry,
  cached,
  clearCache
}
