/*
 * Global 状态管理
 */

import { defineStore } from 'pinia'
import type { GlobalState } from '@/store/interface'
import { piniaStore as store } from '@/store'
import type { DictItem } from '@/api/interface/common'
import type { ApiResponse } from '@/common/http'
import { getDictionaryData } from '@/api/helper/common'

export const useGlobalStore = defineStore('global', {
  state: (): GlobalState => ({
    cachedRoute: [],
    dictMap: {}
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
    // 设置字典
    setDict(key: string, data: DictItem[]) {
      this.dictMap[key] = data
    },
    // 获取字典数据
    getDict(key: string): Promise<DictItem[]> {
      return new Promise((resolve, reject) => {
        if (!this.dictMap[key]) {
          getDictionaryData(key).then((result: ApiResponse<DictItem[]>) => {
            const resultData = result.data as DictItem[]
            this.setDict(key, resultData)
            resolve(resultData)
          })
        } else {
          resolve(this.dictMap[key])
        }
      })
    },
    clearDict() {
      this.dictMap = {}
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
