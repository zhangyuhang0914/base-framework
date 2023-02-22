/**
 * @Desc         :
 * @Autor        : ZYH
 * @Date         : 2023-02-09 11:54:28
 * @LastEditors  : ZYH
 * @LastEditTime : 2023-02-09 12:03:16
*/
import uviewPlus from "uview-plus"
import notify from "uview-plus/libs/config/props/notify"

export const $notify = (message, type, params = {}) => {
  notify({
    type: type,
    message: message,
    duration: 1500,
    ...params
  })
}

export default app => {
  app.provide('$notify', $notify)
  app.use(uviewPlus)
}
