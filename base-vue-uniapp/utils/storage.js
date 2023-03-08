/**
 * @Desc         : storage缓存
 * @Autor        : ZYH
 * @Date         : 2023-03-07 19:37:13
 * @LastEditors  : ZYH
 * @LastEditTime : 2023-03-07 19:37:15
*/
export const getStorage = (key) => {
  return uni.getStorageSync(key)
}

export const setStorage = (key, value) => {
  uni.setStorageSync(key, JSON.stringify(value))
}

export const removeStorage = (key) => {
  return uni.setStorageSync(key, null)
}
