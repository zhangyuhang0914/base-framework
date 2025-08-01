/*
 * @Author       : 超人
 * @Description  : Redux Global 状态接口定义
 * @Date         : 2025-01-27
 * @LastEditTime : 2025-01-27
 */

import type { LanguageKey } from '@/language/interface'

/* GlobalState - 简化后的全局状态 */
export interface GlobalState {
  language: LanguageKey
  algorithmTheme: AlgorithmTheme
}

// 主题类型-默认配置（light）
export type AlgorithmTheme = 'light' | 'dark' | 'compact'
