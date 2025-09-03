/**
 * HTTP 客户端模块
 * 基于 Alova.js 封装的 HTTP 请求工具
 */

// 导出 API 方法
export {
  get,
  post,
  put,
  del as delete,
  patch,
  batch,
  serial,
  retry,
  cached,
  clearCache
} from './api'

// 导出配置
export { defaultInstance as AlovaInstance } from './config'

// 导出类型定义
export type {
  HttpMethod,
  httpRequestConfig,
  ApiResponse,
  RequestInterceptor,
  ResponseInterceptor,
  ApiError,
  RequestStatus,
  CacheStrategy
} from '../interface/http'
