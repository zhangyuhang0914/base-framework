/*
 * @Desc         : storage缓存
 * @Autor        : ZhangYuHang
 * @Date         : 2024-04-12 11:46:36
 * @LastEditors  : ZhangYuHang
 * @LastEditTime : 2024-05-13 15:53:48
 */

export const getStorage = (key: string) => {
  if (!uni.getStorageSync(key)) return
  return JSON.parse(uni.getStorageSync(key))
}

export const setStorage = (key: string, value: any) => {
  uni.setStorageSync(key, JSON.stringify(value))
}

export const removeStorage = (key: string) => {
  return uni.setStorageSync(key, null)
}
