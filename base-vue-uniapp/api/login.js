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
export const login = (params) => {
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
export const getCaptchaCode = (params) => {
  return BASE_PATH['JR'] + `/imageCaptcha?randomId=${Math.random()}`
}
