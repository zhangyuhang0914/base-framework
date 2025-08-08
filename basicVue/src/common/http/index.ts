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
  getPage,
  upload,
  download,
  batch,
  serial,
  retry,
  cached,
  clearCache
} from './api'

// 导出配置
export { alovaInstance as default } from './config'

// 导出类型定义
export type {
  HttpMethod,
  RequestConfig,
  ResponseData,
  PaginationParams,
  PaginationResponse,
  UploadParams,
  UploadResponse,
  RequestInterceptor,
  ResponseInterceptor,
  AlovaConfig,
  ApiError,
  RequestStatus,
  CacheStrategy
} from '../interface/http'
