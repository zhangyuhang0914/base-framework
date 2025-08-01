/*
 * @Author       : 超人
 * @Description  : 偏好设置管理器
 * @Date         : 2025-01-27
 * @LastEditTime : 2025-01-27
 */

import type { Preferences, ThemePreferences } from './types'
import { defaultPreferences } from './defaultPreferences'
import { storageLocal } from '@/utils/storage/storage'
import { ThemeUtils } from '@/utils/common/themeUtils'

// 配置存储键名
const PREFERENCES_KEY = 'USER_PREFERENCES'

/**
 * 偏好设置管理器类
 */
export class PreferencesManager {
  private static instance: PreferencesManager
  private preferences: Preferences
  private listeners: Array<(preferences: Preferences) => void> = []

  private constructor() {
    this.preferences = this.loadPreferences()
  }

  /**
   * 获取单例实例
   */
  static getInstance(): PreferencesManager {
    if (!PreferencesManager.instance) {
      PreferencesManager.instance = new PreferencesManager()
    }
    return PreferencesManager.instance
  }

  /**
   * 从 localStorage 加载配置
   */
  private loadPreferences(): Preferences {
    try {
      const cached = storageLocal.getItem(PREFERENCES_KEY)
      if (cached) {
        // 合并默认配置和缓存配置，确保新增的配置项有默认值
        return this.mergePreferences(defaultPreferences, cached)
      }
    } catch (error) {
      console.warn('加载偏好设置失败:', error)
    }
    return { ...defaultPreferences }
  }

  /**
   * 深度合并配置对象
   */
  private mergePreferences(defaults: Preferences, cached: Partial<Preferences>): Preferences {
    const merged = { ...defaults }

    Object.keys(cached).forEach(key => {
      const typedKey = key as keyof Preferences
      if (cached[typedKey] !== undefined) {
        if (
          typeof defaults[typedKey] === 'object' &&
          defaults[typedKey] !== null &&
          !Array.isArray(defaults[typedKey])
        ) {
          merged[typedKey] = {
            ...defaults[typedKey],
            ...cached[typedKey]
          } as any
        } else {
          merged[typedKey] = cached[typedKey] as any
        }
      }
    })

    return merged
  }

  /**
   * 保存配置到 localStorage
   */
  private savePreferences(): void {
    try {
      storageLocal.setItem(PREFERENCES_KEY, this.preferences)
      this.notifyListeners()
    } catch (error) {
      console.error('保存偏好设置失败:', error)
    }
  }

  /**
   * 通知监听器
   */
  private notifyListeners(): void {
    this.listeners.forEach(listener => {
      try {
        listener(this.preferences)
      } catch (error) {
        console.error('偏好设置监听器执行失败:', error)
      }
    })
  }

  /**
   * 获取当前配置
   */
  getPreferences(): Preferences {
    return { ...this.preferences }
  }

  /**
   * 更新配置
   */
  updatePreferences(updates: Partial<Preferences>): void {
    this.preferences = this.mergePreferences(this.preferences, updates)
    this.savePreferences()
    // 如果主题色发生变化，更新 CSS 变量
    if (updates.theme?.colorPrimary) {
      ThemeUtils.updateThemeColor(updates.theme.colorPrimary)
    }
  }

  /**
   * 更新主题配置
   */
  updateTheme(themeUpdates: Partial<Preferences['theme']>): void {
    this.updatePreferences({
      theme: {
        ...this.preferences.theme,
        ...themeUpdates
      }
    })
  }

  /**
   * 更新应用配置
   */
  updateApp(appUpdates: Partial<Preferences['app']>): void {
    this.updatePreferences({
      app: {
        ...this.preferences.app,
        ...appUpdates
      }
    })
  }

  /**
   * 设置语言
   */
  setLanguage(language: string): void {
    this.updatePreferences({ language })
  }

  /**
   * 设置算法主题
   */
  setAlgorithmTheme(algorithmTheme: 'light' | 'dark' | 'compact'): void {
    this.updatePreferences({ algorithmTheme })
  }

  /**
   * 设置主题色
   */
  setPrimaryColor(colorPrimary: string): void {
    this.updateTheme({ colorPrimary })
  }

  /**
   * 设置圆角值
   */
  setRadius(radius: string): void {
    this.updateTheme({ radius })
  }

  /**
   * 重置为默认配置
   */
  reset(): void {
    try {
      storageLocal.removeItem(PREFERENCES_KEY)
    } catch (error) {
      console.error('清除偏好设置缓存失败:', error)
    }
    // 重置为默认配置，并使用真正的默认主题色
    this.preferences = { ...defaultPreferences }
    const defaultColor = this.getDefaultPrimaryColor()
    this.preferences.theme.colorPrimary = defaultColor
    this.savePreferences()
    // 更新 CSS 变量为默认主题色
    ThemeUtils.updateThemeColor(defaultColor)
  }

  /**
   * 获取默认的主题色（从 CSS 变量获取真正的默认值）
   */
  private getDefaultPrimaryColor(): string {
    const rootStyles = getComputedStyle(document.documentElement)
    const defaultColor = rootStyles.getPropertyValue('--color-primary-default')?.trim()
    return defaultColor || defaultPreferences.theme.colorPrimary
  }

  /**
   * 导出配置为 JSON 字符串
   */
  exportPreferences(): string {
    return JSON.stringify(this.preferences, null, 2)
  }

  /**
   * 从 JSON 字符串导入配置
   */
  importPreferences(jsonString: string): boolean {
    try {
      const imported = JSON.parse(jsonString)
      if (imported && typeof imported === 'object') {
        this.preferences = this.mergePreferences(defaultPreferences, imported)
        this.savePreferences()
        // 如果导入了主题色，更新 CSS 变量
        if (imported.theme?.colorPrimary) {
          ThemeUtils.updateThemeColor(imported.theme.colorPrimary)
        }
        return true
      }
    } catch (error) {
      console.error('导入偏好设置失败:', error)
    }
    return false
  }

  /**
   * 添加配置变化监听器
   */
  addListener(listener: (preferences: Preferences) => void): () => void {
    this.listeners.push(listener)
    // 返回取消监听的函数
    return () => {
      const index = this.listeners.indexOf(listener)
      if (index > -1) {
        this.listeners.splice(index, 1)
      }
    }
  }

  /**
   * 获取特定配置值
   */
  get<K extends keyof Preferences>(key: K): Preferences[K] {
    return this.preferences[key]
  }

  /**
   * 获取嵌套配置值
   */
  getTheme(): Preferences['theme'] {
    return this.preferences.theme
  }

  getApp(): Preferences['app'] {
    return this.preferences.app
  }

  getLanguage(): string {
    return this.preferences.language || 'zh'
  }

  getAlgorithmTheme(): ThemePreferences['mode'] {
    return this.preferences.algorithmTheme || 'light'
  }
}

// 导出单例实例
export const preferencesManager = PreferencesManager.getInstance()
