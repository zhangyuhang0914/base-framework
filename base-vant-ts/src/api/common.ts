'use strict'
import { API as configApi } from '@/conf/index'
import Request from '@/common/http/http'
import type { httpRequestConfig, ApiResponse } from '@/common/http/types'
import type { AttachmentInfo, DictListItem, MicroEnterpriseLoginParamType, MicroEnterpriseLoginResultType, MicroEnterpriseRegisterParamType } from './model/index.ts'

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
 * @desc: 发送验证码
 * @return {*}
 */
export const sendCaptcha = (phoneNumber: string): Promise<ApiResponse<null>> => {
  const param: httpRequestConfig = {
    apiType: 'BASE_URL',
    loading: true,
    url: `/api/sendCaptcha?phoneNumber=${phoneNumber}`
  }
  return Request.post(param)
}

/**
 * @desc: 注册
 * @return {*}
 */
export const microEnterpriseRegister = (params: MicroEnterpriseRegisterParamType): Promise<ApiResponse<null>> => {
  const param: httpRequestConfig = {
    apiType: 'BASE_URL',
    loading: true,
    url: '/api/micro/enterprise/register',
    data: params
  }
  return Request.post(param)
}

/**
 * @desc: 登录
 * @return {*}
 */
export const microEnterpriseLogin = (params: MicroEnterpriseLoginParamType): Promise<ApiResponse<MicroEnterpriseLoginResultType>> => {
  const param: httpRequestConfig = {
    apiType: 'BASE_URL',
    loading: true,
    url: '/api/micro/enterprise/login',
    data: params
  }
  return Request.post(param)
}
