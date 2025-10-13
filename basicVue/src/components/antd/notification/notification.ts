import { notification } from 'ant-design-vue'
import type { NotificationPlacement } from 'ant-design-vue/es/notification'
import type { VNode } from 'vue'

/**
 * 通知配置选项
 */
export interface NotificationOptions {
  /** 通知标题 */
  message: string
  /** 通知描述 */
  description?: string
  /** 显示位置，默认 topRight */
  placement?: NotificationPlacement
  /** 自动关闭延时（秒），默认 4.5 秒，设为 0 则不自动关闭 */
  duration?: number
  /** 点击通知时的回调 */
  onClick?: () => void
  /** 关闭时的回调 */
  onClose?: () => void
  /** 自定义图标 */
  icon?: VNode
  /** 自定义样式类名 */
  className?: string
  /** 自定义样式 */
  style?: Record<string, any>
}

/**
 * 通知类型
 */
export type NotificationType = 'success' | 'info' | 'warning' | 'error'

/**
 * Notification Context 类型
 */
export interface NotificationContextType {
  success: (options: NotificationOptions) => void
  info: (options: NotificationOptions) => void
  warning: (options: NotificationOptions) => void
  error: (options: NotificationOptions) => void
  open: (options: NotificationOptions & { type?: NotificationType }) => void
  destroy: (key?: string) => void
}

/**
 * 通知组件类
 */
export class Notification {
  public static defaultConfig: Partial<NotificationOptions> = {
    placement: 'topRight',
    duration: 4.5
  }
  
  /**
   * 设置全局默认配置
   */
  static config(config: Partial<NotificationOptions>) {
    this.defaultConfig = { ...this.defaultConfig, ...config }
    notification.config({
      placement: config.placement || 'topRight',
      duration: config.duration || 4.5
    })
  }
  
  /**
   * 显示成功通知
   */
  static success(options: NotificationOptions) {
    const finalOptions = { ...this.defaultConfig, ...options }
    notification.success(this.formatOptions(finalOptions))
  }
  
  /**
   * 显示信息通知
   */
  static info(options: NotificationOptions) {
    const finalOptions = { ...this.defaultConfig, ...options }
    notification.info(this.formatOptions(finalOptions))
  }
  
  /**
   * 显示警告通知
   */
  static warning(options: NotificationOptions) {
    const finalOptions = { ...this.defaultConfig, ...options }
    notification.warning(this.formatOptions(finalOptions))
  }
  
  /**
   * 显示错误通知
   */
  static error(options: NotificationOptions) {
    const finalOptions = { ...this.defaultConfig, ...options }
    notification.error(this.formatOptions(finalOptions))
  }
  
  /**
   * 显示自定义通知
   */
  static open(options: NotificationOptions & { type?: NotificationType }) {
    const finalOptions = { ...this.defaultConfig, ...options }
    const { type, ...restOptions } = finalOptions

    if (type) {
      notification[type](this.formatOptions(restOptions))
    } else {
      notification.open(this.formatOptions(restOptions))
    }
  }
  
  /**
   * 关闭通知
   * @param key 可选，指定要关闭的通知key，不传则关闭所有通知
   */
  static destroy(key?: string) {
    notification.destroy()
  }
  
  /**
   * 格式化选项为antd格式
   */
  public static formatOptions(options: NotificationOptions) {
    return {
      message: options.message,
      description: options.description,
      placement: options.placement,
      duration: options.duration,
      onClick: options.onClick,
      onClose: options.onClose,
      icon: options.icon,
      className: options.className,
      style: options.style
    }
  }
}

/**
 * 创建通知实例
 */
export const createNotification = (): NotificationContextType => {
  const success = (options: NotificationOptions) => {
    Notification.success(options)
  }
  
  const info = (options: NotificationOptions) => {
    Notification.info(options)
  }
  
  const warning = (options: NotificationOptions) => {
    Notification.warning(options)
  }
  
  const error = (options: NotificationOptions) => {
    Notification.error(options)
  }
  
  const open = (options: NotificationOptions & { type?: NotificationType }) => {
    Notification.open(options)
  }
  
  const destroy = (key?: string) => {
    Notification.destroy(key)
  }
  
  return {
    success,
    info,
    warning,
    error,
    open,
    destroy
  }
}

export default Notification