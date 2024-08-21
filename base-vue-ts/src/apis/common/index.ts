'use strict'
import { API as configApi } from '@/conf/index'
import Request from '@/common/http/http'
import type { httpRequestConfig, ApiResponse } from '@/common/http/types'
import type { AttachmentInfo, DictListItem, LoginInfoType } from './types.ts'

// 获取接口根路径
const isProd = import.meta.env.MODE === 'production'
const BASE_PATH = isProd ? configApi.production : configApi.development

/**
 * @desc: 文件下载预览
 * @return {*}
 */
export const fileDownload = (id: string) => {
  return `${BASE_PATH['BASE_URL']}/api/fileHandle/download?type=file&ids=${id}`
}

/**
 * @desc: 文件上传
 * @return {*}
 */
export const uploadFile = (params: AnyObject): Promise<ApiResponse<AttachmentInfo>> => {
  const param: httpRequestConfig = {
    apiType: 'BASE_URL',
    loading: true,
    url: '/api/fileHandle/upload',
    formUpload: true,
    data: params
  }
  return Request.post(param) as Promise<ApiResponse<AttachmentInfo>>
}

/**
 * @desc: 获取图形验证码
 * @param {captchaId} captchaId
 * @return {*}
 */
export const captchaCode = (captchaId: number) => {
  return `${BASE_PATH['BASE_URL']}/api/web/captcha.jpg?captchaId=${captchaId}`
}

/**
 * 系统内部通用-短信验证码
 * @return {*}
 */
export const CommonSendSMS = (phone: string): Promise<ApiResponse<AnyObject>> => {
  const param: httpRequestConfig = {
    apiType: 'BASE_URL',
    loading: true,
    url: '/api/verify?phoneNumber=' + phone
  }
  return Request.post(param) as Promise<ApiResponse<AnyObject>>
}

/**
 * @desc: 字典
 * @return {*}
 */
export const getDictParamData = (dictType: string): Promise<ApiResponse<DictListItem[]>> => {
  const param: httpRequestConfig = {
    apiType: 'BASE_URL',
    loading: true,
    url: `/api/fin/product/info/treeMap?dicTypeSign=${dictType}`
  }
  return Request.get(param) as Promise<ApiResponse<DictListItem[]>>
}

/**
 * @desc: 登录
 * @return {*}
 */
export const login = (params: AnyObject = {}): Promise<ApiResponse<LoginInfoType>> => {
  const param: httpRequestConfig = {
    apiType: 'BASE_URL',
    loading: true,
    url: '/api/web/login',
    data: params
  }
  return Request.post(param) as Promise<ApiResponse<LoginInfoType>>
}

/**
 * @desc: 退出登录
 * @return {*}
 */
export const logout = (params: AnyObject = {}): Promise<ApiResponse<AnyObject>> => {
  const param: httpRequestConfig = {
    apiType: 'BASE_URL',
    loading: true,
    url: '/api/web/logout',
    data: params
  }
  return Request.post(param) as Promise<ApiResponse<AnyObject>>
}
