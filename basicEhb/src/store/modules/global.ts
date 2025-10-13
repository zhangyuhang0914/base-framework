/*
 * Global 状态管理
 */

import { defineStore } from 'pinia'
import type { GlobalState } from '@/store/interface'
import { piniaStore as store } from '@/store'

export const useGlobalStore = defineStore('global', {
  state: (): GlobalState => ({
    cachedRoute: []
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
    }
  },
  getters: {},
  // 持久化存储 开启数据缓存
  persist: {
    key: 'global', // 存储key
    storage: localStorage, // 存储方式，默认是sessionStorage
    pick: ['cachedRoute'] // 需要存储的字段，在新版插件中使用pick替代paths
  }
})

export function useGlobalStoreHook() {
  return useGlobalStore(store)
}
