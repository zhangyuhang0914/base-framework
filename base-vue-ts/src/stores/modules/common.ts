import { defineStore } from 'pinia'
import { store } from '../index'
import type { CommonType } from './types'

export const userCommonStore = defineStore({
  id: 'common',
  state: (): CommonType => ({
    onlineState: true,
    cachedRoute: []
  }),
  actions: {
    // 设置网络状态
    setOnlineState(flag: boolean) {
      this.onlineState = flag
    },
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
  }
})

export function userCommonStoreHook() {
  return userCommonStore(store)
}
