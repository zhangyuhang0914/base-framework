/*
 * @Desc         : Ant Design Vue 配置
 * @Autor        : ZhangYuHang
 * @Date         : 2024-06-14 10:21:59
 * @LastEditors  : Please set LastEditors
 * @LastEditTime : 2025-08-07 14:30:14
 */

import type { App } from 'vue'
import Antd, { message, notification, Modal, type ModalProps } from 'ant-design-vue'
import type { NotificationArgsProps } from 'ant-design-vue/es/notification'
import 'ant-design-vue/dist/reset.css'

// 全局消息提示
export const $message = {
  success: (content: string, duration = 3) => message.success(content, duration),
  error: (content: string, duration = 3) => message.error(content, duration),
  info: (content: string, duration = 3) => message.info(content, duration),
  warning: (content: string, duration = 3) => message.warning(content, duration),
  loading: (content: string, duration = 0) => message.loading(content, duration)
}

// 全局通知
export const $notification = {
  success: (config: NotificationArgsProps) => notification.success(config),
  error: (config: NotificationArgsProps) => notification.error(config),
  info: (config: NotificationArgsProps) => notification.info(config),
  warning: (config: NotificationArgsProps) => notification.warning(config)
}

// 全局确认框
export const $confirm = (config: ModalProps) => {
  return Modal.confirm({
    title: '确认',
    content: '确定要执行此操作吗？',
    okText: '确定',
    cancelText: '取消',
    ...config
  })
}

// Ant Design Vue 安装函数
export default function setupAntDesignVue(app: App<Element>) {
  // 注册 Ant Design Vue
  app.use(Antd)
  // 挂载到全局属性
  app.config.globalProperties.$message = $message
  app.config.globalProperties.$notification = $notification
  app.config.globalProperties.$confirm = $confirm

  // 挂载到 window 对象，供其他模块使用
  if (typeof window !== 'undefined') {
    ;(window as any).$message = $message
    ;(window as any).$notification = $notification
    ;(window as any).$confirm = $confirm
  }
  // 提供给组合式 API 使用
  app.provide('$message', $message)
  app.provide('$notification', $notification)
  app.provide('$confirm', $confirm)
}
