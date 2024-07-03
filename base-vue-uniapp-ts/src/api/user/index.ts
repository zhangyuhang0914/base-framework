'use strict'
import Request from '@/common/http/http'
import type { httpRequestConfig, ApiResponse } from '@/common/http/types'

/**
 *  保存用户头像
 */
export const saveUserTx = (params: AnyObject) => {
  const param: httpRequestConfig = {
    apiType: 'BASE_URL',
    method: 'POST',
    loading: false,
    url: '/api/weixin/uias/saveUserTx',
    params: params
  }
  return Request.request(param)
}

/**
 * 融资记录列表
 */
export const financeList = (params: AnyObject) => {
  const param: httpRequestConfig = {
    apiType: 'BASE_URL',
    method: 'GET',
    loading: false,
    url: '/api/financial/loan/inquiryinfo/list',
    params: params
  }
  return Request.request(param)
}

/**
 * 产品收藏列表
 */
export const collectionList = (params: AnyObject) => {
  const param: httpRequestConfig = {
    apiType: 'BASE_URL',
    method: 'GET',
    loading: false,
    url: '/api/web/collection/list',
    params: params
  }
  return Request.request(param)
}

/**
 *  获取用户信息
 */
export const wxUserInfo = (params: AnyObject) => {
  const param: httpRequestConfig = {
    apiType: 'BASE_URL',
    method: 'POST',
    loading: true,
    url: '/api/weixin/uias/wxUserInfo',
    params: params
  }
  return Request.request(param)
}

/**
 *  修改手机号码
 */
export const changePhone = (params: AnyObject) => {
  const param: httpRequestConfig = {
    apiType: 'BASE_URL',
    method: 'POST',
    loading: true,
    url: '/api/weixin/uias/changePhone',
    params: params
  }
  return Request.request(param)
}

/**
 *  确认授权对象
 */
export const saveFileCredit = (params: AnyObject) => {
  const param: httpRequestConfig = {
    apiType: 'BASE_URL',
    method: 'POST',
    loading: true,
    url: '/api/financial/loan/inquiryinfo/saveFileCredit',
    params: params
  }
  return Request.request(param)
}

/**
 *  绑定企业信息
 */
export const loginEntUsingActive = (params: AnyObject) => {
  const param: httpRequestConfig = {
    apiType: 'BASE_URL',
    method: 'POST',
    loading: true,
    url: '/api/weixin/uias/loginEntUsingActive',
    params: params
  }
  return Request.request(param)
}

/**
 *  企业注册绑定-法人信息校验
 */
export const regEntInfoStepOne = (params: AnyObject): Promise<ApiResponse<AnyObject>> => {
  const param: httpRequestConfig = {
    apiType: 'BASE_URL',
    method: 'POST',
    loading: true,
    url: '/api/weixin/uias/regEntInfoStepOne',
    params: params
  }
  return Request.request(param)
}

/**
 *  企业注册绑定-企业信息校验
 */
export const regEntInfoStepTwo = (params: AnyObject): Promise<ApiResponse<AnyObject>> => {
  const param: httpRequestConfig = {
    apiType: 'BASE_URL',
    method: 'POST',
    loading: true,
    url: '/api/weixin/uias/regEntInfoStepTwo',
    params: params
  }
  return Request.request(param)
}

/**
 *  企业注册绑定
 */
export const regEntInfoStep = (params: AnyObject) => {
  const param: httpRequestConfig = {
    apiType: 'BASE_URL',
    method: 'POST',
    loading: true,
    url: '/api/weixin/uias/regEntInfoStep',
    params: params
  }
  return Request.request(param)
}

/**
 *  选择企业查询管理用户列表
 */
export const uiasEntInfo = (params: AnyObject) => {
  const param: httpRequestConfig = {
    apiType: 'BASE_URL',
    method: 'POST',
    loading: true,
    url: '/api/weixin/uias/entInfo',
    params: params
  }
  return Request.request(param)
}

/**
 *  解绑用户
 */
export const uiasUnbindUser = (params: AnyObject) => {
  const param: httpRequestConfig = {
    apiType: 'BASE_URL',
    method: 'POST',
    loading: true,
    url: '/api/weixin/uias/unbindUser',
    params: params
  }
  return Request.request(param)
}

/**
 *  切换登录企业
 */
export const uiasSwitchEnt = (params: AnyObject) => {
  const param: httpRequestConfig = {
    apiType: 'BASE_URL',
    method: 'POST',
    loading: true,
    url: '/api/weixin/uias/switchEnt',
    params: params
  }
  return Request.request(param)
}

/**
 *  根据企业名称获取统一社会信用代码
 */
export const queryByEntName = (params: AnyObject) => {
  const param: httpRequestConfig = {
    apiType: 'BASE_URL',
    method: 'POST',
    loading: false,
    url: '/api/weixin/uias/queryByEntName',
    params: params,
    noShowMsg: true
  }
  return Request.request(param)
}
