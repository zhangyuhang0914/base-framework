'use strict'
import Request from '@/common/http/http'
import { API as configApi } from '@/conf'
import type { httpRequestConfig, ApiResponse } from '@/common/http/types'
import type { UiasAccountLoginParam, UiasUserInfoType, UiasRegisterParam, UiasPhoneLoginParam, EntInfoType } from './types'

// 获取接口根路径
const isProd = import.meta.env.MODE === 'production'
const BASE_PATH: AnyObject = isProd ? configApi.production : configApi.development

/**
 * 上传文件
 */
export const upload = (filePath: string, params?: AnyObject) => {
  const param: httpRequestConfig = {
    url: '/api/fileHandle/upload',
    filePath,
    loading: true,
    params: params,
    apiType: 'BASE_URL'
  }
  return Request.requestUpload(param)
}
/**
 * 预览文件
 */
export const preview = (fileId: string) => {
  const baseUrl = BASE_PATH['BASE_URL']
  return `${baseUrl}/api/fileHandle/download?type=file&ids=${fileId}`
}

/**
 * 下载文件
 */
export const download = (fileId: string, fileExtSuffix: string) => {
  const baseUrl = BASE_PATH['BASE_URL']
  return `${baseUrl}/api/fileHandle/download/${fileId}${fileExtSuffix}`
}

/**
 * 下载模版文件
 */
export const downloadFile = (fileId: string) => {
  const baseUrl = BASE_PATH['BASE_URL']
  return `${baseUrl}/api/fileHandle/download/?type=file&ids=${fileId}`
}

/**
 * 系统内部通用-短信验证码
 * @return {*}
 */
export const CommonSendSMS = (phone: string): Promise<ApiResponse<AnyObject>> => {
  const param: httpRequestConfig = {
    apiType: 'BASE_URL',
    method: 'POST',
    loading: true,
    url: '/api/verify?phoneNumber=' + phone
  }
  return Request.request(param) as Promise<ApiResponse<AnyObject>>
}

/**
 * @desc: 手机验证登录-短信验证码
 * @return {*}
 */
export const UiasSendSMSLogin = (params: AnyObject): Promise<ApiResponse<AnyObject>> => {
  const param: httpRequestConfig = {
    apiType: 'BASE_URL',
    method: 'POST',
    loading: true,
    url: '/api/weixin/uias/smsCode',
    params: params
  }
  return Request.request(param) as Promise<ApiResponse<AnyObject>>
}

/**
 * @desc: 自然人注册-短信验证码
 * @return {*}
 */
export const UiasSendSMSForRegActive = (params: AnyObject): Promise<ApiResponse<AnyObject>> => {
  const param: httpRequestConfig = {
    apiType: 'BASE_URL',
    method: 'POST',
    loading: true,
    url: '/api/weixin/uias/sendSMSForRegActive',
    params: params
  }
  return Request.request(param) as Promise<ApiResponse<AnyObject>>
}

/**
 * @desc: 忘记密码-短信验证码
 * @return {*}
 */
export const UiasSendSMSForPwd = (params: AnyObject): Promise<ApiResponse<AnyObject>> => {
  const param: httpRequestConfig = {
    apiType: 'BASE_URL',
    method: 'POST',
    loading: true,
    url: '/api/weixin/uias/sendSMS',
    params: params
  }
  return Request.request(param) as Promise<ApiResponse<AnyObject>>
}

/**
 * @desc: 自然人账号密码登录
 * @return {*}
 */
export const UiasAccountLoginActive = (params: UiasAccountLoginParam): Promise<ApiResponse<{ userInfo: UiasUserInfoType; entInfo: EntInfoType }>> => {
  const param: httpRequestConfig = {
    apiType: 'BASE_URL',
    method: 'POST',
    loading: true,
    url: '/api/weixin/uias/loginUsingActive',
    params: params
  }
  return Request.request(param) as Promise<ApiResponse<{ userInfo: UiasUserInfoType; entInfo: EntInfoType }>>
}

/**
 * @desc: 自然人手机验证登录
 * @return {*}
 */
export const UiasPhoneLoginActive = (params: UiasPhoneLoginParam): Promise<ApiResponse<{ userInfo: UiasUserInfoType; entInfo: EntInfoType }>> => {
  const param: httpRequestConfig = {
    apiType: 'BASE_URL',
    method: 'POST',
    loading: true,
    url: '/api/weixin/uias/loginPhoneCode',
    params: params
  }
  return Request.request(param) as Promise<ApiResponse<{ userInfo: UiasUserInfoType; entInfo: EntInfoType }>>
}

/**
 * @desc: 自然人注册
 * @return {*}
 */
export const uiasRegisterUserInfoStep = (params: UiasRegisterParam): Promise<ApiResponse<AnyObject>> => {
  const param: httpRequestConfig = {
    apiType: 'BASE_URL',
    method: 'POST',
    loading: true,
    url: '/api/weixin/uias/regUserInfoStep',
    params: params
  }
  return Request.request(param) as Promise<ApiResponse<AnyObject>>
}

/**
 * @desc: 忘记密码
 * @return {*}
 */
export const uiasForgotPsd = (params: AnyObject): Promise<ApiResponse<AnyObject>> => {
  const param: httpRequestConfig = {
    apiType: 'BASE_URL',
    method: 'POST',
    loading: true,
    url: '/api/weixin/uias/findPsdNew',
    params: params
  }
  return Request.request(param) as Promise<ApiResponse<AnyObject>>
}

/**
 * @desc: 保存更新企业联系人信息
 * @return {*}
 */
export const enterpriseUpdateContact = (params: AnyObject): Promise<ApiResponse<AnyObject>> => {
  const param: httpRequestConfig = {
    apiType: 'BASE_URL',
    method: 'POST',
    loading: true,
    url: '/api/web/enterprises/updateContact',
    params: params
  }
  return Request.request(param) as Promise<ApiResponse<AnyObject>>
}
