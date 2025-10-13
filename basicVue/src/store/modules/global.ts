/*
 * @Desc         : Global 状态管理
 * @Autor        : ZhangYuHang
 * @Date         : 2025-08-08 18:04:14
 * @LastEditors  : Please set LastEditors
 * @LastEditTime : 2025-09-10 18:17:09
 */

import { defineStore } from 'pinia'
import type { LanguageKey } from '@/language/interface'
import { preferencesManager } from '@/config/preferencesManager'
import type { GlobalState } from '@/store/interface'
import { piniaStore as store } from '@/store'
import type { AlgorithmTheme } from '@/store/interface/global'

export const useGlobalStore = defineStore('global', {
  state: (): GlobalState => ({
    cachedRoute: [],
    language: preferencesManager.getLanguage() as LanguageKey,
    algorithmTheme: preferencesManager.getAlgorithmTheme()
  }),
  actions: {
    // 设置缓存路由
    setCached(str: string, type?: string) {
      if (type === 'del') {
        this.cachedRoute = this.cachedRoute.filter((item: string) => item !== str)
        return false
      }
      if (!this.cachedRoute.some(item => item === str)) {
        this.cachedRoute.push(str)
      }
    },
    setLanguage(language: string) {
      preferencesManager.setLanguage(language)
      this.language = preferencesManager.getLanguage() as LanguageKey
    },
    setAlgorithmTheme(algorithmTheme: AlgorithmTheme) {
      preferencesManager.setAlgorithmTheme(algorithmTheme)
    }
  },
  getters: {},
  // 持久化存储 开启数据缓存
  persist: {
    key: 'global', // 存储key
    storage: localStorage, // 存储方式，默认是sessionStorage
    pick: ['cachedRoute', 'language', 'algorithmTheme'] // 需要存储的字段，在新版插件中使用pick替代paths
  }
})

export function useGlobalStoreHook() {
  return useGlobalStore(store)
}
