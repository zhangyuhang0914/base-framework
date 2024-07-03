import { App } from 'vue'
import ElementPlus, { ElMessage } from 'element-plus'

export const $message = (
  message: string,
  type: 'error' | 'info' | 'success' | 'warning' = 'error',
  params: any = {}
) => {
  ElMessage({
    type: type || 'warning',
    message,
    duration: 1500,
    grouping: false,
    offset: 50,
    ...params
  })
}
export default (app: App) => {
  app.provide('$message', $message)
  app.use(ElementPlus, {
    size: 'large'
  })
}
