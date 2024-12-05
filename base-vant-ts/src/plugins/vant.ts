import {
  Notify,
  Toast,
  setNotifyDefaultOptions,
  showNotify,
  showToast,
  type NotifyOptions,
  type ToastType,
  type ToastOptions
} from 'vant'
import { type App } from 'vue'

interface NotifyHandlers {
  notifyInstance: any
  showNotification: (message: string, options?: NotifyOptions) => void
  closeNotification: () => void
}

/**
 * 轻提示
 */
export const $toast = (
  message: string,
  type?: ToastType,
  options?: ToastOptions
) => {
  showToast({
    message: message,
    type: type ?? 'text',
    ...options
  })
}

/**
 * 消息通知
 */
export const $notify = (): NotifyHandlers => {
  let notifyInstance: any = null
  // 显示消息通知
  const showNotification = (message: string, options?: NotifyOptions) => {
    notifyInstance = showNotify({
      message,
      duration: options?.duration || 1500
    })
  }
  // 关闭消息通知
  const closeNotification = () => {
    if (notifyInstance && typeof notifyInstance.closeNotify === 'function') {
      notifyInstance.closeNotify()
      notifyInstance = null
    }
  }
  return { notifyInstance, showNotification, closeNotification }
}

export default (app: App) => {
  app.use(Notify)
  app.use(Toast)

  // 修改 notify 默认配置
  setNotifyDefaultOptions({
    duration: 1500
  })
}
