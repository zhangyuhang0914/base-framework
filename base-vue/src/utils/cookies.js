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

export function getToken () {
  return Cookies.get(TokenKey)
}

export function setToken (token) {
  return Cookies.set(TokenKey, token, { expires: Expires }) // 有效期为7天
}

export function removeToken () {
  return Cookies.remove(TokenKey)
}
