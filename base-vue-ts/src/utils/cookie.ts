/*
 * @Desc         : 鉴权
 * @Autor        : ZhangYuHang
 * @Date         : 2024-06-14 10:53:42
 * @LastEditors  : ZhangYuHang
 * @LastEditTime : 2024-06-14 10:53:49
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