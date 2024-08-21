/*
 * @Desc         : Element-Plus
 * @Autor        : ZhangYuHang
 * @Date         : 2024-06-14 10:21:59
 * @LastEditors  : ZhangYuHang
 * @LastEditTime : 2024-08-21 17:20:15
 */

import type { App } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
export const $message = (message: string, type: 'error' | 'info' | 'success' | 'warning' = 'error', params: AnyObject = {}) => {
  ElMessage({
    type: type,
    message: message,
    duration: 1500,
    offset: 50,
    ...params
  })
}
export const $confirm = (title: string, message: string, params: AnyObject = {}) => {
  return ElMessageBox({
    title: title,
    message: message,
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    ...params
  })
}
export default (app: App) => {
  app.provide('$message', $message)
}
