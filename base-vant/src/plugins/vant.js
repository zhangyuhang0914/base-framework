/**
 * @Desc         : vant引入
 * @Autor        : ZhangYuHang
 * @Date         : 2023-06-05 15:10:43
 * @LastEditors  : ZhangYuHang
 * @LastEditTime : 2023-06-05 15:48:34
 */
import Vant, { Toast } from 'vant'
import zhCn from 'vant/lib/locale/lang/zh-cn'
export const $toast = (message, type, params = {}) => {
  Toast({
    type: type,
    message: message,
    duration: 1500,
    offset: 50,
    ...params
  })
}

export default app => {
  app.provide('$toast', $toast)
  app.use(Vant, {
    locale: zhCn
  })
}
