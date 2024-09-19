import type { DictListItem } from '@/apis/common/types'

/**
 * 分割数组
 * @param {*} arr 数组
 * @param {*} size 分割大小
 */
export const splitArr = <T>(arr: T[], size: number): T[][] => {
  if (arr.length === 0) return []
  const result: T[][] = []
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size))
  }
  return result
}

/**
 * 节流函数
 * @param {*} fn 执行函数
 * @param {*} delay 延迟时间
 */
export const throttle = (fn: () => void, delay: number = 300, first: boolean = true) => {
  let timer: any = null
  return function (this: any, ...params: any) {
    const self = this // 取debounce执行作用域的this
    if (first) {
      fn.apply(self, params)
      first = false
      return
    }
    if (timer) {
      return
    }
    timer = setTimeout(function () {
      fn.apply(self, params)
      timer = null
    }, delay)
  }
}

/**
 * 防抖函数
 * @param {*} fn 要执行的方法
 * @param {*} delay 延迟
 */
export const debounce = (fn: Function, delay: number = 300) => {
  // 维护一个 timer
  let timer: any
  return function (this: any) {
    // 取debounce执行作用域的this
    let self = this
    let args = arguments
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(function () {
      // 用apply指向调用debounce的对象，相当于_this.fn(args)
      fn.apply(self, args)
    }, delay)
  }
}

/**
 * dom font-size
 */
export const getDomFontSize = (size: number, type?: string): any => {
  const rem = parseFloat(document.documentElement.style.fontSize)
  if (type === 'rem') {
    return size / 16 + 'rem'
  }
  if (rem) {
    size = (size / 16) * rem
  }
  return size
}

/**
 * 字符串脱敏
 * @param {*} str 字符串
 * @param {*} start 开始位置
 * @param {*} end 结束位置
 * @returns 脱敏
 */
export const maskString = (str: string, startIndex: number = 2, endIndex: number = 4) => {
  if (!str) return ''
  if (str.length <= startIndex + endIndex) {
    return str
  }
  const start = str.slice(0, startIndex)
  const end = str.slice(-endIndex)
  const middle = '*'.repeat(str.length - startIndex - endIndex)
  return start + middle + end
}

/**
 * 获取文件后缀
 * @param {*} fileName 文件名
 * @returns 文件后缀
 */
export const getFileType = (fileName: string) => {
  let filea = fileName.split('.')
  return filea[filea.length - 1].toLowerCase()
}

/**
 * 判断值是否为小数
 * @param {number | string} value - 需要判断的值
 * @returns {boolean} - 如果包含小数点返回 true，否则返回 false
 */
export const hasDecimal = (value: number | string): boolean => {
  return typeof value === 'number' || typeof value === 'string' ? value.toString().includes('.') : false
}

/**
 * 附件下载
 * @param {string} url - 附件地址
 * @param {string} name - 附件名称
 */
export const download = (url: string, name: string): void => {
  let a = document.createElement('a')
  a.href = url
  a.download = name
  a.target = '_blank'
  a.click()
  a.remove()
}

/**
 * 时间格式化 YYYY-MM-DD 格式
 * @param str
 * @returns YYYY-MM-DD
 */
export const formatToYearMonthDay = (str: string): string => {
  if (!str) return ''
  const date = new Date(str)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * amountRule
 * @param {*} 千分位计算
 * @param {*} amount 计算值
 */
export const amountRule = (amount: string) => {
  let defaultAmount = ''
  let setAmount = amount + ''
  if (setAmount != 'null' && setAmount != '' && setAmount != 'undefined') {
    defaultAmount = setAmount
      .split('')
      .join('')
      .replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
    return defaultAmount
  } else {
    return defaultAmount
  }
}

/**
 * 根据字典值获取字典名称
 * @param
 * @param {*} dictList 字典
 * @param {*} value 字典值
 * @returns
 */
export const getDictName = (dictList: DictListItem[], value: string): string => {
  return dictList.find(item => item.value === value)?.name || ''
}

/**
 * flatten
 * @param {*} 数组打平
 * @param {*} arr 数组
 */
export const flatten = (arr: any[]) => {
  return arr.reduce((conArr, value) => {
    return conArr.concat(Array.isArray(value) ? flatten(value) : value)
  }, [])
}

/**
 * 列表转数
 * @param list 列表
 * @param id 主键id
 * @param pkey 父级id
 * @param childrenKey 子级key
 * @returns 树形结构
 */
export const listToTree = <T extends Record<string, any>>(list: T[], id: keyof T = 'id', pkey: keyof T = 'pid', childrenKey: string = 'children'): T[] => {
  const map = new Map<string, T>()
  const newList: T[] = []
  list &&
    list.forEach(item => {
      map.set(item[id] as string, item)
    })
  map.forEach(item => {
    if (map.has(item[pkey] as string)) {
      const parent = map.get(item[pkey] as string)
      if (parent) {
        // @ts-ignore
        parent[childrenKey] = parent[childrenKey] || []
        parent[childrenKey].push(item)
      }
    } else {
      newList.push(item)
    }
  })
  return newList
}

/**
 * 判断字符串类型
 * @param str 字符串
 * @returns 类型
 */
export const getStringType = (str: any) => {
  return Object.prototype.toString.call(str)
}

/**
 * 判断是否为空对象
 * @param ob 对象
 * @returns boolean
 */
export const isEmptyObject = (obj: any) => {
  return Object.keys(obj).length === 0 && obj.constructor === Object
}

// sha1加密
export const SHA1 = (s: any): string => {
  const data = new Uint8Array(encodeUTF8(s))
  let i, j, t
  const l = (((data.length + 8) >>> 6) << 4) + 16
  const sArray = new Uint8Array(l << 2)
  sArray.set(new Uint8Array(data.buffer))
  s = new Uint32Array(sArray.buffer)

  for (t = new DataView(s.buffer), i = 0; i < l; i++) s[i] = t.getUint32(i << 2)
  s[data.length >> 2] |= 0x80 << (24 - (data.length & 3) * 8)
  s[l - 1] = data.length << 3

  const w: number[] = []
  const f = [() => (m[1] & m[2]) | (~m[1] & m[3]), () => m[1] ^ m[2] ^ m[3], () => (m[1] & m[2]) | (m[1] & m[3]) | (m[2] & m[3]), () => m[1] ^ m[2] ^ m[3]]

  const rol = (n: number, c: number) => (n << c) | (n >>> (32 - c))
  const k = [1518500249, 1859775393, -1894007588, -899497514]
  const m = [1732584193, -271733879, 0, 0, -1009589776]
  m[2] = ~m[0]
  m[3] = ~m[1]

  for (i = 0; i < s.length; i += 16) {
    const o = m.slice(0)
    for (j = 0; j < 80; j++) {
      w[j] = j < 16 ? s[i + j] : rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1)
      t = (rol(m[0], 5) + f[(j / 20) | 0]() + m[4] + w[j] + k[(j / 20) | 0]) | 0
      m[1] = rol(m[1], 30)
      m.pop()
      m.unshift(t)
    }
    for (j = 0; j < 5; j++) m[j] = (m[j] + o[j]) | 0
  }

  t = new DataView(new Uint32Array(m).buffer)
  for (i = 0; i < 5; i++) m[i] = t.getUint32(i << 2)

  const hex = Array.prototype.map.call(new Uint8Array(new Uint32Array(m).buffer), e => (e < 16 ? '0' : '') + e.toString(16)).join('')
  return hex
}

export const encodeUTF8 = (s: string): number[] => {
  const r: number[] = []
  for (let i = 0; i < s.length; i++) {
    let c = s.charCodeAt(i)
    if (c < 0x80) {
      r.push(c)
    } else if (c < 0x800) {
      r.push(0xc0 + ((c >> 6) & 0x1f), 0x80 + (c & 0x3f))
    } else {
      if ((c ^ 0xd800) >> 10 === 0) {
        const x = (c ^ 0xd800) >> 10
        c = (x << 10) + (s.charCodeAt(++i) ^ 0xdc00) + 0x10000
        r.push(0xf0 + ((c >> 18) & 0x7), 0x80 + ((c >> 12) & 0x3f))
      } else {
        r.push(0xe0 + ((c >> 12) & 0xf))
      }
      r.push(0x80 + ((c >> 6) & 0x3f), 0x80 + (c & 0x3f))
    }
  }
  return r
}
