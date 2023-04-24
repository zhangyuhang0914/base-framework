/**
 * @Desc         : 登录相关接口
 * @Autor        : ZYH
 * @Date         : 2023-04-24 14:49:25
 * @LastEditors  : ZYH
 * @LastEditTime : 2023-04-24 15:06:04
 */
'use strict'
import http from '@/common/http/http-async'

/**
 * @desc: 登录
 * @return {*}
 * @author: ZYH
 */
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
