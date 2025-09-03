/*
 * @Desc         : Global 状态管理
 * @Autor        : ZhangYuHang
 * @Date         : 2025-08-08 18:04:14
 * @LastEditors  : Please set LastEditors
 * @LastEditTime : 2025-08-08 18:04:14
 */

import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { LanguageKey } from '@/language/interface'
import { preferencesManager } from '@/config/preferencesManager'

// 使用组合式 API 风格定义 global store
export const useGlobalStore = defineStore(
  'global',
  () => {
    // 状态
    const language = ref<LanguageKey>(preferencesManager.getLanguage() as LanguageKey)
    const algorithmTheme = ref<'light' | 'dark' | 'compact'>(preferencesManager.getAlgorithmTheme())

    // 方法
    const setLanguage = (newLanguage: LanguageKey) => {
      language.value = newLanguage
      // 同步更新到配置管理器
      preferencesManager.setLanguage(newLanguage)
    }
    const setAlgorithmTheme = (newTheme: 'light' | 'dark' | 'compact') => {
      algorithmTheme.value = newTheme
      // 同步更新到配置管理器
      preferencesManager.setAlgorithmTheme(newTheme)
    }
    // 从配置管理器同步状态到 Pinia
    const syncFromPreferences = () => {
      language.value = preferencesManager.getLanguage() as LanguageKey
      algorithmTheme.value = preferencesManager.getAlgorithmTheme()
    }

    return {
      // 状态
      language,
      algorithmTheme,
      // 方法
      setLanguage,
      setAlgorithmTheme,
      syncFromPreferences
    }
  },
  {
    // 持久化配置
    persist: {
      key: 'global-store',
      pick: ['language', 'algorithmTheme'],
      storage: typeof window !== 'undefined' ? localStorage : undefined
    }
  }
)
