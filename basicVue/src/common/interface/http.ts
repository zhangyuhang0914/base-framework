/*
 * @Desc         : Alova.js HTTP 客户端相关类型定义
 * @Autor        : ZhangYuHang
 * @Date         : 2024-12-19 18:00:00
 * @LastEditors  : Please set LastEditors
 * @LastEditTime : 2025-08-07 17:26:28
 */

import type { AlovaMethodConfig, AlovaRequestAdapter, AlovaGenerics } from 'alova'

// HTTP 请求方法类型
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS'

// 项目的 Alova 泛型配置
export interface ProjectAlovaGenerics extends AlovaGenerics {
  RequestConfig: {
    headers?: Record<string, string>
    params?: Record<string, unknown>
    timeout?: number
  }
  ResponseHeader: Record<string, string>
  ResponseBody: ResponseData
}

// 请求配置接口
export interface RequestConfig
  extends AlovaMethodConfig<ProjectAlovaGenerics, ResponseData, ResponseData> {
  // 是否显示加载状态
  loading?: boolean
  // 是否显示错误提示
  showError?: boolean
  // 是否显示成功提示
  showSuccess?: boolean
  // 成功提示消息
  successMessage?: string
  // 错误提示消息
  errorMessage?: string
  // 请求重试次数
  retryTimes?: number
  // 请求超时时间（毫秒）
  timeout?: number
  // 是否需要认证
  auth?: boolean
  // 自定义请求头
  headers?: Record<string, string>
}

// 响应数据接口
export interface ResponseData<T = any> {
  // 响应状态码
  code: number
  // 响应消息
  message: string
  // 响应数据
  data: T
  // 是否成功
  success: boolean
  // 时间戳
  timestamp?: number
  // 请求ID
  requestId?: string
}

// 分页请求参数
export interface PaginationParams {
  // 当前页码
  page: number
  // 每页数量
  pageSize: number
  // 排序字段
  sortBy?: string
  // 排序方向
  sortOrder?: 'asc' | 'desc'
}

// 分页响应数据
export interface PaginationResponse<T = any> {
  // 数据列表
  list: T[]
  // 总数量
  total: number
  // 当前页码
  page: number
  // 每页数量
  pageSize: number
  // 总页数
  totalPages: number
  // 是否有下一页
  hasNext: boolean
  // 是否有上一页
  hasPrev: boolean
}

// 文件上传参数
export interface UploadParams {
  // 文件对象
  file: File
  // 上传路径
  path?: string
  // 文件名
  filename?: string
  // 额外参数
  data?: Record<string, any>
}

// 文件上传响应
export interface UploadResponse {
  // 文件URL
  url: string
  // 文件名
  filename: string
  // 文件大小
  size: number
  // 文件类型
  type: string
  // 文件路径
  path: string
}

// 请求拦截器配置
export interface RequestInterceptor {
  // 请求前拦截
  onRequest?: (config: RequestConfig) => RequestConfig | Promise<RequestConfig>
  // 请求错误拦截
  onRequestError?: (error: Error) => void | Promise<void>
}

// 响应拦截器配置
export interface ResponseInterceptor {
  // 响应成功拦截
  onResponse?: <T>(response: ResponseData<T>) => ResponseData<T> | Promise<ResponseData<T>>
  // 响应错误拦截
  onResponseError?: (error: Error) => void | Promise<void>
}

// Alova 实例配置
export interface AlovaConfig {
  // 基础URL
  baseURL: string
  // 默认超时时间
  timeout?: number
  // 请求适配器
  requestAdapter?: AlovaRequestAdapter<ProjectAlovaGenerics, any, any>
  // 默认请求头
  headers?: Record<string, string>
  // 请求拦截器
  requestInterceptor?: RequestInterceptor
  // 响应拦截器
  responseInterceptor?: ResponseInterceptor
  // 是否启用缓存
  enableCache?: boolean
  // 缓存时间（毫秒）
  cacheTime?: number
  // 是否启用重试
  enableRetry?: boolean
  // 重试次数
  retryTimes?: number
}

// API 错误类型
export interface ApiError {
  // 错误码
  code: number
  // 错误消息
  message: string
  // 错误详情
  details?: any
  // 请求URL
  url?: string
  // 请求方法
  method?: HttpMethod
  // 时间戳
  timestamp?: number
}

// 请求状态类型
export const RequestStatus = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error'
} as const

export type RequestStatus = (typeof RequestStatus)[keyof typeof RequestStatus]

// 缓存策略类型
export const CacheStrategy = {
  // 不缓存
  NO_CACHE: 'no-cache',
  // 内存缓存
  MEMORY: 'memory',
  // 本地存储缓存
  LOCAL_STORAGE: 'localStorage',
  // 会话存储缓存
  SESSION_STORAGE: 'sessionStorage'
} as const

export type CacheStrategy = (typeof CacheStrategy)[keyof typeof CacheStrategy]
