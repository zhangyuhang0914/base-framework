/*
 * @Desc         : element引入
 * @Autor        : ZYH
 * @Date         : 2023-02-08 09:51:42
 * @LastEditors  : ZYH
 * @LastEditTime : 2023-02-08 10:40:06
 */
import { App } from "vue"
import ElementPlus, { ElMessage } from 'element-plus'
import zhCn from 'element-plus/lib/locale/lang/zh-cn'
export const $message = (message: string, type: "error" | "info" | "success" | "warning" = 'error', params: AnyObject = {}) => {
  ElMessage({
    type: type,
    message: message,
    duration: 1500,
    offset:50,
    ...params
  })
}
export default (app: App) => {
  app.provide('$message', $message)
  app.use(ElementPlus, {
    locale: zhCn,
  })
}
