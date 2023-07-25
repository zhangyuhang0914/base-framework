import { BASE_CONFIG } from '@/conf/index'
import http from '@/commons/http'

/*
 * 获取图形验证码
 * */
export const imageCaptcha = (captchaId, apiType) => {
  let ajaxPath = BASE_CONFIG[apiType || 'defaultAjaxPath']
  return `${ajaxPath}/captcha.jpg?captchaId=${captchaId}`
}

export const test = param => {
  const params = {
    method: 'get',
    test: true,
    testUrl: param.testUrl,
    url: `/captcha.jpg?captchaId=${param.captchaId}`,
    json: true
  }
  return http(params)
}
