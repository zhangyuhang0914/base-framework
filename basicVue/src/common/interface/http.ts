/*
 * @Desc         : HTTP 客户端相关类型定义（兼容Alova）
 * @Autor        : ZhangYuHang
 * @Date         : 2024-12-19 18:00:00
 * @LastEditors  : Please set LastEditors
 * @LastEditTime : 2025-09-03 17:13:11
 */

import type { AlovaGenerics, Method } from 'alova'
export interface ProjectAlovaGenerics<T> extends AlovaGenerics {
  RequestConfig: httpRequestConfig
  ResponseHeader: Record<string, string>
  ResponseBody: ApiResponse<T>
}

// HTTP 请求配置接口
export interface httpRequestConfig extends Partial<Omit<Method, 'url'>> {
  // 接口地址
  url?: string
  // 自定义请求头
  headers?: Record<string, string>
  // 请求超时时间（毫秒）
  timeout?: number
  // 请求上下文
  apiType?: string
  // 是否需要认证
  auth?: boolean
  // 表单上传
  isForm?: boolean
  // 附件上传
  formUpload?: boolean
  // 上传文件资源的路径
  filePath?: string
  // 是否post请求，并且是formData格式
  isPostAndFormData?: boolean
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
  onUploadProgress?: (progressEvent: ProgressEvent) => void
}

// 定义通用响应结构
export interface ApiResponse<T> {
  /**
   * 接口状态
   */
  code: number
  /**
   * 接口数据
   */
  data?: T
  /**
   * 分页数据
   */
  page?: ApiResponsePage<T>
  /**
   * 接口提示
   */
  msg?: string
  message?: string
  // 时间戳
  timestamp?: number
  // 请求ID
  requestId?: string
}

export interface ApiResponsePage<T> {
  /**
   * 当前页数
   */
  currPage: number
  /**
   * 接口数据
   */
  list: T
  /**
   * 每页条数
   */
  pageSize: number
  /**
   * 总条目数
   */
  totalCount: number
  /**
   * 总页数
   */
  totalPage: number
}

// 请求拦截器配置
export interface RequestInterceptor {
  // 请求前拦截
  onRequest?: (config: httpRequestConfig) => httpRequestConfig | Promise<httpRequestConfig>
  // 请求错误拦截
  onRequestError?: (error: Error) => void | Promise<void>
}

// 响应拦截器配置
export interface ResponseInterceptor {
  // 响应成功拦截
  onResponse?: <T>(response: ApiResponse<T>) => ApiResponse<T> | Promise<ApiResponse<T>>
  // 响应错误拦截
  onResponseError?: (error: Error) => void | Promise<void>
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
  method?: string
  // 时间戳
  timestamp?: number
}

// HTTP 请求方法类型
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS'

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
