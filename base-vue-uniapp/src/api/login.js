import { request } from '@/common/http/http-async'
import { API as configApi } from '@/conf/index'

// 获取接口跟路径
const isProd = import.meta.env.MODE === 'production'
const BASE_PATH = isProd ? configApi.production : configApi.development

/**
 * @desc: 登录
 * @return {*}
 * @author: ZYH
*/
export const login = (params = {}) => {
  const param = {
    apiType: 'JR',
    method: 'post',
    json: true,
    url: '/api/internet/login',
    params: params
  }
  return request(param)
}

/**
 * @desc: 验证码
 * @return {*}
 * @author: ZYH
*/
export const getCaptchaCode = (params = {}) => {
  return BASE_PATH['JR'] + `/imageCaptcha?randomId=${Math.random()}`
}

/**
 * @desc: 机构列表
 * @return {*}
 * @author: ZYH
*/
export const getYApplJbxxList = (params = {}) => {
  const param = {
    apiType: 'JR',
    method: 'post',
    json: true,
    url: '/api/internet/getYApplJbxxList',
    params: params
  }
  return request(param)
}

/**
 * @desc: 注册
 * @return {*}
 * @author: ZYH
*/
export const register = (params) => {
  const param = {
    apiType: 'JR',
    method: 'post',
    json: true,
    url: '/api/internet/register',
    params: params
  }
  return request(param)
}

/**
 * @desc: 验证码
 * @return {*}
 * @author: ZYH
*/
export const sendsms = (params) => {
  const param = {
    apiType: 'JR',
    method: 'post',
    json: true,
    url: '/api/internet/sendsms',
    params: params
  }
  return request(param)
}

/**
 * @desc: 忘记密码
 * @return {*}
 * @author: ZYH
*/
export const resetPassword = (params) => {
  const param = {
    apiType: 'JR',
    method: 'post',
    json: true,
    url: '/api/internet/resetPassword',
    params: params
  }
  return request(param)
}
