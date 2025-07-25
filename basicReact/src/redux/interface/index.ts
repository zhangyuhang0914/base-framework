/*
 * @Author       : 超人
 * @Description  : 授人以渔，功德无量，利在千秋
 * @Date         : 2025-07-08 10:33:55
 * @LastEditTime : 2025-07-23 16:16:58
 */

import type { LanguageKey } from '@/language/interface'
import type { ThemeConfig } from 'antd'

/* 主题配置接口 */
export interface ThemeSettings {
  primaryColor: string
  config?: ThemeConfig
}

/* 布局配置接口 */
export interface LayoutSettings {
  // 可以在这里添加布局相关的配置
  siderCollapsed?: boolean
  showHeader?: boolean
  showFooter?: boolean
}

/* 系统设置配置接口 */
export interface SettingConf {
  theme: ThemeSettings
  layout?: LayoutSettings
  // 可以在这里添加其他类型的配置
}

/* GlobalState */
export interface GlobalState {
  language: LanguageKey
  settingConf: SettingConf
}

/* UserState */
export interface UserState {
  token: string
}
