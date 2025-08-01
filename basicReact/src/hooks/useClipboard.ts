import { useState, useCallback } from 'react'
import { useGlobalNotification } from '@/components/antd'
import type { NotificationPlacement } from 'antd/es/notification/interface'
import type { NotificationArgsProps } from 'antd'

/**
 * useClipboard Hook 配置选项
 */
interface UseClipboardOptions {
  /** 复制状态重置的超时时间（毫秒），默认 2000ms */
  timeout?: number
}

/**
 * 环境检查结果
 */
interface EnvironmentCheck {
  isSupported: boolean
  isClipboardAPISupported: boolean
  isFallbackSupported: boolean
  isSecureContext: boolean
  protocol: string
  reason?: string
}

/**
 * 复制函数的选项配置
 */
interface CopyOptions {
  // 要复制的文本内容
  text: string
  // 弹出的位置
  placement?: NotificationPlacement
  // 自定义成功消息
  successMessage?: string
  // 自定义失败消息
  errorMessage?: string
  // 自定义通知提醒内容
  notificationContent?: string
}

/**
 * useClipboard Hook 返回值
 */
interface UseClipboardReturn {
  /** 最后一次复制的文本内容 */
  value: string | null
  /** 复制文本到剪贴板的函数，返回 Promise<boolean> 表示是否成功 */
  onCopy: (text: string) => Promise<boolean>
  /** 是否刚刚完成复制操作（会在 timeout 时间后自动重置为 false） */
  hasCopied: boolean
  /** 环境检查结果 */
  environment: EnvironmentCheck
  /** 带通知的复制函数 */
  copy: (options: CopyOptions) => Promise<boolean>
}

/**
 * 剪贴板操作 Hook
 *
 * 提供复制文本到剪贴板的功能，支持状态管理、环境检查和通知处理
 * @param options 配置选项
 * @returns 剪贴板操作相关的状态和方法
 */
export const useClipboard = (options: UseClipboardOptions = {}): UseClipboardReturn => {
  const { timeout = 2000 } = options
  const [value, setValue] = useState<string | null>(null)
  const [hasCopied, setHasCopied] = useState(false)
  const notification = useGlobalNotification()

  /**
   * 检查剪贴板环境支持情况
   */
  const checkEnvironment = useCallback((): EnvironmentCheck => {
    const isClipboardAPISupported = Boolean(
      typeof navigator !== 'undefined' &&
        navigator.clipboard &&
        'writeText' in navigator.clipboard &&
        typeof window !== 'undefined' &&
        window.isSecureContext
    )
    const isFallbackSupported = Boolean(typeof document !== 'undefined' && document.execCommand)
    const isSecureContext = typeof window !== 'undefined' && window.isSecureContext
    const protocol = typeof window !== 'undefined' ? window.location.protocol : 'unknown'
    const isLocalhost =
      typeof window !== 'undefined' &&
      (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')

    const isSupported = isClipboardAPISupported || isFallbackSupported
    let reason: string | undefined
    if (!isSupported) {
      if (protocol === 'http:' && !isLocalhost) {
        reason = '需要 HTTPS 协议或 localhost 环境'
      } else {
        reason = '浏览器不支持剪贴板操作'
      }
    }
    return {
      isSupported,
      isClipboardAPISupported,
      isFallbackSupported,
      isSecureContext,
      protocol,
      reason
    }
  }, [])

  // 获取环境检查结果
  const environment = checkEnvironment()

  /**
   * 使用传统方法复制文本（降级方案）
   */
  const copyWithFallback = useCallback(async (text: string): Promise<boolean> => {
    try {
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      textArea.style.top = '-999999px'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      const result = document.execCommand('copy')
      document.body.removeChild(textArea)
      return result
    } catch (error) {
      console.error('Fallback copy failed:', error)
      return false
    }
  }, [])

  /**
   * 核心复制逻辑，不包含通知处理
   */
  const copyToClipboard = useCallback(
    async (text: string): Promise<boolean> => {
      if (!environment.isSupported) {
        notification.error({
          message: '剪贴板不支持',
          description: environment.reason
        })
        return false
      }
      try {
        // 优先尝试现代 Clipboard API
        if (environment.isClipboardAPISupported) {
          await navigator.clipboard.writeText(text)
          return true
        } else if (environment.isFallbackSupported) {
          // 降级到传统方法
          return await copyWithFallback(text)
        }
        return false
      } catch (error) {
        console.error('复制失败:', error)
        return false
      }
    },
    [environment, copyWithFallback]
  )

  /**
   * 基础复制函数，只处理状态更新
   */
  const onCopy = useCallback(
    async (text: string): Promise<boolean> => {
      const success = await copyToClipboard(text)
      if (success) {
        setValue(text)
        setHasCopied(true)
        // 设置定时器重置状态
        setTimeout(() => {
          setHasCopied(false)
        }, timeout)
      }
      return success
    },
    [copyToClipboard, timeout]
  )

  /**
   * 带通知的复制函数
   */
  const copy = useCallback(
    async (options: CopyOptions & Partial<NotificationArgsProps>): Promise<boolean> => {
      const {
        text,
        successMessage = '复制成功',
        errorMessage = '剪贴板不支持',
        placement = 'topRight'
      } = options
      // 检查环境支持情况
      if (!environment.isSupported) {
        const message = environment.reason || errorMessage
        notification.error({
          message: errorMessage,
          placement: placement,
          description: message
        })
        return false
      }
      try {
        const success = await copyToClipboard(text)
        if (success) {
          // 更新状态
          setValue(text)
          setHasCopied(true)
          setTimeout(() => {
            setHasCopied(false)
          }, timeout)
          // 显示成功通知
          notification.success({
            message: successMessage,
            placement: placement,
            description: options.notificationContent
          })
        } else {
          // 显示失败通知
          notification.error({
            message: errorMessage,
            placement: placement,
            description: options.notificationContent
          })
        }
        return success
      } catch (error) {
        // 显示错误通知
        notification.error({
          message: errorMessage,
          placement: placement,
          description: error instanceof Error ? error.message : '未知错误'
        })
        return false
      }
    },
    [environment, copyToClipboard, timeout]
  )
  return {
    value,
    onCopy,
    hasCopied,
    environment,
    copy
  }
}

export default useClipboard
