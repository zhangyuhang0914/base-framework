/*
 * @Desc         : 鉴权的cookie
 * @Autor        : ZhangYuHang
 * @Date         : 2023-09-27 13:43:36
 * @LastEditors  : ZhangYuHang
 * @LastEditTime : 2023-09-27 13:43:48
 */

import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
const Expires = 365

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token: string, expires?: number | Date) {
  return Cookies.set(TokenKey, token, { expires: expires || Expires })
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
