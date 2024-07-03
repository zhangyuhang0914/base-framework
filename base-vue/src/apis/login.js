/**
 * @Desc         : 登录相关接口
 * @Autor        : ZYH
 * @Date         : 2023-04-24 14:49:25
 * @LastEditors  : ZhangYuHang
 * @LastEditTime : 2023-06-25 14:04:15
 */
'use strict'
import http from '@/common/http/http-async'

/**
 * @desc: 登录
 * @return {*}
 * @author: ZYH
 */
/*
 * 获取图形验证码
 * */
export const imageCaptcha = (captchaId, apiType) => {
  const param = {
    apiType: 'JR',
    method: 'get',
    json: true,
    url: `/captcha.jpg?captchaId=${captchaId}`
  }
  return http(param)
}

export const login = params => {
  const param = {
    apiType: 'JR',
    method: 'get',
    json: true,
    url: '/api/login',
    params: params
  }
  return http(param)
}
