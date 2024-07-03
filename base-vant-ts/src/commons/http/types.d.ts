// type.ts
import type { AxiosRequestConfig } from 'axios'

export interface httpRequestConfig extends AxiosRequestConfig {
  baseURL?: string
  headers?: any
  timeout?: number
  apiType?: string
  json?: boolean
  form?: [boolean, string]
  formUpload?: [boolean, string]
}

// 定义通用响应结构
export interface ApiResponse<T> {
  code: number
  data: T
  message: string
}
