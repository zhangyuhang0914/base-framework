/**
 * @Desc         :
 * @Autor        : ZYH
 * @Date         : 2023-01-29 13:58:37
 * @LastEditors  : ZYH
 * @LastEditTime : 2023-01-30 16:21:23
 */

import ElementPlus, { ElMessage } from 'element-plus'
import zhCn from 'element-plus/lib/locale/lang/zh-cn'
export const $message = (message, type, params = {}) => {
  ElMessage({
    type: type,
    message: message,
    duration: 1500,
    offset: 50,
    ...params
  })
}

export default app => {
  app.provide('$message', $message)
  app.use(ElementPlus, {
    locale: zhCn
  })
}
