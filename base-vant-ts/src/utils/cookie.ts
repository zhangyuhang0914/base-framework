/*
 * @Desc         : 鉴权的cookie
 * @Autor        : ZhangYuHang
 * @Date         : 2024-12-03 18:06:07
 * @LastEditors  : ZhangYuHang
 * @LastEditTime : 2024-12-09 16:02:26
 */

import Cookies from 'js-cookie'

const CookieKeys = {
  TokenKey: 'Admin-Token',
  JsessionKey: 'JSESSIONID'
}
// key值类型 ('TokenKey' | 'JsessionKey')
export type CookieKeyType = keyof typeof CookieKeys
// 具体值类型 ('Admin-Token' | 'JSESSIONID')
export type CookieKeyValues = (typeof CookieKeys)[CookieKeyType]

// 获取cookie
export function getCookie(cookieKey: CookieKeyType): string | undefined {
  return Cookies.get(CookieKeys[cookieKey])
}

// 设置cookie (缓存不传默认设置 7 天)
export function setCookie(cookieKey: CookieKeyType, token: string, expires: number | Date = 7): void {
  Cookies.set(CookieKeys[cookieKey], token, { expires: expires })
}

// 移除cookie
export function removeCookie(cookieKey: CookieKeyType): void {
  Cookies.remove(CookieKeys[cookieKey])
}

// 获取所有cookie
export function getAllCookies(): Record<CookieKeyType, string | undefined> {
  return {
    TokenKey: Cookies.get(CookieKeys.TokenKey),
    JsessionKey: Cookies.get(CookieKeys.JsessionKey)
  }
}
