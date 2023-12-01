// type.ts
import type { AxiosRequestConfig } from 'axios'

export interface httpRequestConfig extends AxiosRequestConfig {
  baseURL?: string
  headers?: any
  timeout?: number
  apiType?: string
  secure?: string
  json?: boolean
  form?: [boolean, string]
  formUpload?: [boolean, string]
  data?: any
}

// 定义通用响应结构
export interface ApiResponse<T> {
  code: number
  data: T
  msg: string
  expire: number
  person: AnyObject
  token: string
  userId: string
  page: T
}
