/**
 * @Desc         :
 * @Autor        : ZYH
 * @Date         : 2023-02-09 11:54:28
 * @LastEditors  : ZYH
 * @LastEditTime : 2023-03-08 09:52:48
*/
import uviewPlus from "uview-plus"

export const $toast = (message) => {
  uni.$u.toast(message)
}

export default app => {
  app.provide('$toast', $toast)
  app.use(uviewPlus)
}
