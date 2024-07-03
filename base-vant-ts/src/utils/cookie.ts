/*
 * @Desc         : 鉴权的cookie
 * @Autor        : ZhangYuHang
 * @Date         : 2023-08-22 09:48:54
 * @LastEditors  : ZhangYuHang
 * @LastEditTime : 2023-08-22 10:00:06
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
