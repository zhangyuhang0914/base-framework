/**
 * @Desc         : 鉴权的cookie
 * @Autor        : ZYH
 * @Date         : 2023-02-17 17:52:39
 * @LastEditors  : ZYH
 * @LastEditTime : 2023-02-17 17:54:58
 */

import Cookies from 'js-cookie'

const TokenKey = 'JSESSIONID'

const Expires = '7'

export function getJsessionId () {
  return Cookies.get(TokenKey)
}

export function setJsessionId (token) {
  return Cookies.set(TokenKey, token, { expires: Expires }) // 有效期为7天
}

export function remoceJsessionid () {
  return Cookies.remove(TokenKey)
}
