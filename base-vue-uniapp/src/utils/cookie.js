/**
 * @Desc         : 鉴权的cookie
 * @Autor        : ZYH
 * @Date         : 2023-02-13 10:37:45
 * @LastEditors  : ZYH
 * @LastEditTime : 2023-02-13 10:41:43
*/
import Cookies from "js-cookie"

const TokenKey = 'JSESSIONID'

const Expires = '360'

export function getToken () {
  return Cookies.get(TokenKey)
}

export function setToken (token) {
  return Cookies.set(TokenKey, token, { expires: Expires }) // 有效期为360
}

export function removeToken () {
  return Cookies.remove(TokenKey)
}
