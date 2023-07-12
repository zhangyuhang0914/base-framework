import { BASE_CONFIG } from '@/conf/index'

/*
 * 获取图形验证码
 * */
export const imageCaptcha = (captchaId, apiType) => {
  let ajaxPath = BASE_CONFIG[apiType || 'defaultAjaxPath']
  return `${ajaxPath}/captcha.jpg?captchaId=${captchaId}`
}
