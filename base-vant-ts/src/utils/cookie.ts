/*
 * @Desc         : 鉴权的cookie
 * @Autor        : ZhangYuHang
 * @Date         : 2024-12-03 18:06:07
 * @LastEditors  : ZhangYuHang
 * @LastEditTime : 2024-12-09 15:31:39
 */

import Cookies from 'js-cookie'

const CookieKeys = {
  TokenKey: 'Admin-Token',
  JsessionKey: 'JSESSIONID'
}
// key值类型
type CookieKeyType = keyof typeof CookieKeys
// 具体值类型
type CookieKeyValues = (typeof CookieKeys)[CookieKeyType]
export function getToken(cookieKey: CookieKeyValues): any {
  return Cookies.get(cookieKey)
}

export function setToken(token: string, expires: number | Date, cookieKey: CookieKeyValues): void {
  Cookies.set(cookieKey, token, { expires: expires })
}

export function removeToken(cookieKey: CookieKeyValues): void {
  Cookies.remove(cookieKey)
}
