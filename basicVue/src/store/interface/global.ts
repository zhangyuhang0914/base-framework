/*
 * @Desc         : Global 状态相关类型定义
 * @Autor        : 超人
 * @Date         : 2025-08-08 18:04:14
 * @LastEditTime : 2025-08-08 18:04:14
 */

import type { LanguageKey } from '@/language/interface'

// Global 状态接口
export interface GlobalState {
  language: LanguageKey
  algorithmTheme: AlgorithmTheme
}

// 主题类型-默认配置（light）
export type AlgorithmTheme = 'light' | 'dark' | 'compact'
