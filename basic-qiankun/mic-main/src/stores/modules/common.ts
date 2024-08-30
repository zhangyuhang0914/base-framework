import { defineStore } from 'pinia'
import { store } from '../index'
interface commonType {
  onlineState: boolean // 网络状态
  cachedRoute: Array<string>
  currentRoute: AnyObject
}

export const userCommonStore = defineStore({
  id: 'common',
  state: (): commonType => ({
    onlineState: true,
    cachedRoute: [],
    currentRoute: {} // 当前路由
  }),
  actions: {
    setOnlineState(flag: boolean) {
      this.onlineState = flag
    },
    // 设置缓存路由
    setCached(str: string, type?: string) {
      if (type === 'del') {
        this.cachedRoute = this.cachedRoute.filter(item => item !== str)
        return false
      }
      if (!this.cachedRoute.some(item => item === str)) {
        this.cachedRoute.push(str)
      }
    },
    setRouter(item: AnyObject) {
      this.currentRoute = item
    }
  }
})

export function userCommonStoreHook() {
  return userCommonStore(store)
}
