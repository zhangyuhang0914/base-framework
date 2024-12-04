/*
 * @Desc         : 鉴权的cookie
 * @Autor        : ZhangYuHang
 * @Date         : 2024-12-03 18:06:07
 * @LastEditors  : ZhangYuHang
 * @LastEditTime : 2024-12-04 10:22:29
 */

import * as Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

export function getToken(): any {
  return Cookies.get(TokenKey)
}

export function setToken(token: string, expires?: number | Date): void {
  Cookies.set(TokenKey, token, { expires: expires })
}

export function removeToken(): void {
  Cookies.remove(TokenKey)
}
