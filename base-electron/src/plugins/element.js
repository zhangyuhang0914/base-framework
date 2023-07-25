/**
 * @Desc         : element-plus
 * @Autor        : ZhangYuHang
 * @Date         : 2023-07-07 11:46:09
 * @LastEditors  : ZhangYuHang
 * @LastEditTime : 2023-07-12 11:10:34
 */
import ElementPlus, { ElMessage } from 'element-plus'
// import zhCn from 'element-plus/lib/locale/lang/zh-cn.js'
export const $message = (message, type, params) => {
  ElMessage({
    type: type || 'warning',
    message: message,
    duration: 1500,
    grouping: true,
    offset: 50,
    ...params
  })
}
export default app => {
  app.provide('$message', $message)
  app.use(ElementPlus, {
    size: 'large',
    // locale: zhCn
  })
  // 全局修改属性有问题，考虑自定义组件处理
  app._context.components.ElDialog.props.modal.default = false
}
