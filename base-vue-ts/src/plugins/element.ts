/*
 * @Desc         : Element-Plus
 * @Autor        : ZhangYuHang
 * @Date         : 2024-06-14 10:21:59
 * @LastEditors  : ZhangYuHang
 * @LastEditTime : 2024-06-14 11:46:31
 */

import type { App } from 'vue'
import { ElMessage } from 'element-plus'
export const $message = (message: string, type: 'error' | 'info' | 'success' | 'warning' = 'error', params: AnyObject = {}) => {
  ElMessage({
    type: type,
    message: message,
    duration: 1500,
    offset: 50,
    ...params
  })
}
export default (app: App) => {
  app.provide('$message', $message)
}
