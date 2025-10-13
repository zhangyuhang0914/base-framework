/*
 * Vant 配置
 */

import type { App } from 'vue'
import { showToast, showLoadingToast, closeToast, showDialog } from 'vant'

// 全局消息提示
export const $message = {
  success: (content: string, duration = 2000) => showToast({
    message: content,
    type: 'success',
    duration
  }),
  error: (content: string, duration = 2000) => showToast({
    message: content,
    type: 'fail',
    duration
  }),
  info: (content: string, duration = 2000) => showToast({
    message: content,
    type: 'text',
    duration
  }),
  warning: (content: string, duration = 2000) => showToast({
    message: content,
    type: 'warning',
    duration
  }),
  loading: (content: string) => showLoadingToast({
    message: content,
    forbidClick: true
  }),
  closeAll: () => closeToast()
}

// 全局确认框
export const $confirm = (config: { title?: string, content: string, confirmButtonText?: string, cancelButtonText?: string }) => {
  return showDialog({
    title: config.title || '确认',
    message: config.content,
    confirmButtonText: config.confirmButtonText || '确定',
    cancelButtonText: config.cancelButtonText || '取消'
  })
}

// Vant 安装函数
export default function setupVant(app: App<Element>) {
  // 挂载到全局属性
  app.config.globalProperties.$message = $message
  app.config.globalProperties.$confirm = $confirm

  // 挂载到 window 对象，供其他模块使用
  if (typeof window !== 'undefined') {
    ;(window as any).$message = $message
    ;(window as any).$confirm = $confirm
  }

  // 提供给组合式 API 使用
  app.provide('$message', $message)
  app.provide('$confirm', $confirm)
}
