/**
 * @Desc         : 鉴权的cookie
 * @Autor        : ZhangYuHang
 * @Date         : 2023-06-05 15:44:06
 * @LastEditors  : ZhangYuHang
 * @LastEditTime : 2023-06-06 11:15:52
 */

import Cookies from 'js-cookie'

const TokenKey = 'JSESSIONID'

const Expires = '7'

export function getJsessionId() {
  return Cookies.get(TokenKey)
}

export function setJsessionId(token) {
  return Cookies.set(TokenKey, token, { expires: Expires }) // 有效期为7天
}

export function remoceJsessionid() {
  return Cookies.remove(TokenKey)
}
