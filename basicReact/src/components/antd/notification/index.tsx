import React, { useCallback, useMemo, createContext, useContext } from 'react'
import { notification as antdNotification, type NotificationArgsProps } from 'antd'
import type { NotificationPlacement } from 'antd/es/notification/interface'

/**
 * 通知配置选项
 */
export interface NotificationOptions extends Omit<NotificationArgsProps, 'message'> {
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
  icon?: React.ReactNode
  /** 自定义样式类名 */
  className?: string
  /** 自定义样式 */
  style?: React.CSSProperties
}

/**
 * 通知类型
 */
export type NotificationType = 'success' | 'info' | 'warning' | 'error'

/**
 * Notification Context 类型
 */
interface NotificationContextType {
  success: (options: NotificationOptions) => void
  info: (options: NotificationOptions) => void
  warning: (options: NotificationOptions) => void
  error: (options: NotificationOptions) => void
  open: (options: NotificationOptions & { type?: NotificationType }) => void
  destroy: (key?: string) => void
}

/**
 * Notification Context
 */
const NotificationContext = createContext<NotificationContextType | null>(null)

/**
 * 通知组件类
 */
class Notification {
  public static defaultConfig: Partial<NotificationOptions> = {
    placement: 'topRight',
    duration: 4.5
  }
  /**
   * 设置全局默认配置
   */
  static config(config: Partial<NotificationOptions>) {
    this.defaultConfig = { ...this.defaultConfig, ...config }
    antdNotification.config({
      placement: config.placement || 'topRight',
      duration: config.duration || 4.5
    })
  }
  /**
   * 显示成功通知
   */
  static success(options: NotificationOptions) {
    const finalOptions = { ...this.defaultConfig, ...options }
    antdNotification.success(this.formatOptions(finalOptions))
  }
  /**
   * 显示信息通知
   */
  static info(options: NotificationOptions) {
    const finalOptions = { ...this.defaultConfig, ...options }
    antdNotification.info(this.formatOptions(finalOptions))
  }
  /**
   * 显示警告通知
   */
  static warning(options: NotificationOptions) {
    const finalOptions = { ...this.defaultConfig, ...options }
    antdNotification.warning(this.formatOptions(finalOptions))
  }
  /**
   * 显示错误通知
   */
  static error(options: NotificationOptions) {
    const finalOptions = { ...this.defaultConfig, ...options }
    antdNotification.error(this.formatOptions(finalOptions))
  }
  /**
   * 显示自定义通知
   */
  static open(options: NotificationOptions & { type?: NotificationType }) {
    const finalOptions = { ...this.defaultConfig, ...options }
    const { type, ...restOptions } = finalOptions

    if (type) {
      antdNotification[type](this.formatOptions(restOptions))
    } else {
      antdNotification.open(this.formatOptions(restOptions))
    }
  }
  /**
   * 关闭通知
   * @param key 可选，指定要关闭的通知key，不传则关闭所有通知
   */
  static destroy(key?: string) {
    if (key) {
      antdNotification.destroy(key)
    } else {
      antdNotification.destroy()
    }
  }
  /**
   * 格式化选项为antd格式
   */
  public static formatOptions(options: NotificationOptions): NotificationArgsProps {
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
 * Hook 方式使用通知
 */
export const useNotification = () => {
  const [api, contextHolder] = antdNotification.useNotification()
  const success = useCallback(
    (options: NotificationOptions) => {
      api.success(Notification.formatOptions({ ...Notification.defaultConfig, ...options }))
    },
    [api]
  )
  const info = useCallback(
    (options: NotificationOptions) => {
      api.info(Notification.formatOptions({ ...Notification.defaultConfig, ...options }))
    },
    [api]
  )
  const warning = useCallback(
    (options: NotificationOptions) => {
      api.warning(Notification.formatOptions({ ...Notification.defaultConfig, ...options }))
    },
    [api]
  )
  const error = useCallback(
    (options: NotificationOptions) => {
      api.error(Notification.formatOptions({ ...Notification.defaultConfig, ...options }))
    },
    [api]
  )
  const open = useCallback(
    (options: NotificationOptions & { type?: NotificationType }) => {
      const { type, ...restOptions } = options
      const finalOptions = Notification.formatOptions({
        ...Notification.defaultConfig,
        ...restOptions
      })
      if (type) {
        api[type](finalOptions)
      } else {
        api.open(finalOptions)
      }
    },
    [api]
  )
  const destroy = useCallback(
    (key?: string) => {
      if (key) {
        api.destroy(key)
      } else {
        api.destroy()
      }
    },
    [api]
  )
  const notification = useMemo(
    () => ({
      success,
      info,
      warning,
      error,
      open,
      destroy
    }),
    [success, info, warning, error, open, destroy]
  )
  return [notification, contextHolder] as const
}

/**
 * NotificationProvider 组件
 * 提供全局的 notification 上下文
 */
export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notification, contextHolder] = useNotification()
  return (
    <NotificationContext.Provider value={notification}>
      {contextHolder}
      {children}
    </NotificationContext.Provider>
  )
}

/**
 * 使用全局 notification 的 Hook
 * 这个 Hook 不会创建新的 contextHolder，而是使用全局的
 */
export const useGlobalNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useGlobalNotification must be used within a NotificationProvider')
  }
  return context
}

export default Notification
