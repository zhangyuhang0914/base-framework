'use strict'
/**
 * @Desc         : 公用方法
 * @Autor        : ZhangYuHang
 * @Date         : 2023-07-07 11:50:10
 * @LastEditors  : ZhangYuHang
 * @LastEditTime : 2023-07-07 11:50:51
 */

import { userCommonStoreHook } from '@/stores/modules/common'
import { Store } from '@/commons/store'
const commonStore = userCommonStoreHook()

// 是否空值
export const isEmpty = v => {
  switch (typeof v) {
    case 'undefined':
      return true
    case 'string':
      if (v.replace(/(^[ \t\n\r]*)|([ \t\n\r]*$)/g, '').length === 0) {
        return true
      }
      break
    case 'boolean':
      if (!v) return true
      break
    case 'number':
      if (v === 0 || isNaN(v)) return true
      break
    case 'object':
      if (v === null || v.length === 0) return true
      for (var i in v) {
        return false
      }
      return true
  }
  return false
}

export const getFormatDate = date => {
  return `${date[0]}-${date[1]}-${date[2]}`
}

// 异步获取 base_url
export const getBaseUrl = async () => {
  if (!commonStore.baseUrl) {
    const result = await Store.getItem('base_url')
    commonStore.setBaseUrl(result)
    return result
  } else {
    return commonStore.baseUrl
  }
}

/* eslint-disable */
export const SHA1 = s => {
  var data = new Uint8Array(encodeUTF8(s))
  var i, j, t
  var l = (((data.length + 8) >>> 6) << 4) + 16,
    s = new Uint8Array(l << 2)
  s.set(new Uint8Array(data.buffer)), (s = new Uint32Array(s.buffer))
  for (t = new DataView(s.buffer), i = 0; i < l; i++) s[i] = t.getUint32(i << 2)
  s[data.length >> 2] |= 0x80 << (24 - (data.length & 3) * 8)
  s[l - 1] = data.length << 3
  var w = [],
    f = [
      function () {
        return (m[1] & m[2]) | (~m[1] & m[3])
      },
      function () {
        return m[1] ^ m[2] ^ m[3]
      },
      function () {
        return (m[1] & m[2]) | (m[1] & m[3]) | (m[2] & m[3])
      },
      function () {
        return m[1] ^ m[2] ^ m[3]
      }
    ],
    rol = function (n, c) {
      return (n << c) | (n >>> (32 - c))
    },
    k = [1518500249, 1859775393, -1894007588, -899497514],
    m = [1732584193, -271733879, null, null, -1009589776]
    ; (m[2] = ~m[0]), (m[3] = ~m[1])
  for (i = 0; i < s.length; i += 16) {
    var o = m.slice(0)
    for (j = 0; j < 80; j++)
      (w[j] =
        j < 16
          ? s[i + j]
          : rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1)),
        (t =
          (rol(m[0], 5) + f[(j / 20) | 0]() + m[4] + w[j] + k[(j / 20) | 0]) |
          0),
        (m[1] = rol(m[1], 30)),
        m.pop(),
        m.unshift(t)
    for (j = 0; j < 5; j++) m[j] = (m[j] + o[j]) | 0
  }
  t = new DataView(new Uint32Array(m).buffer)
  for (var i = 0; i < 5; i++) m[i] = t.getUint32(i << 2)

  var hex = Array.prototype.map
    .call(new Uint8Array(new Uint32Array(m).buffer), function (e) {
      return (e < 16 ? '0' : '') + e.toString(16)
    })
    .join('')
  return hex
}

const encodeUTF8 = s => {
  var i,
    r = [],
    c,
    x
  for (i = 0; i < s.length; i++)
    if ((c = s.charCodeAt(i)) < 0x80) r.push(c)
    else if (c < 0x800) r.push(0xc0 + ((c >> 6) & 0x1f), 0x80 + (c & 0x3f))
    else {
      if ((x = c ^ 0xd800) >> 10 == 0)
        //对四字节UTF-16转换为Unicode
        (c = (x << 10) + (s.charCodeAt(++i) ^ 0xdc00) + 0x10000),
          r.push(0xf0 + ((c >> 18) & 0x7), 0x80 + ((c >> 12) & 0x3f))
      else r.push(0xe0 + ((c >> 12) & 0xf))
      r.push(0x80 + ((c >> 6) & 0x3f), 0x80 + (c & 0x3f))
    }
  return r
}
