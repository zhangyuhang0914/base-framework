import { defineStore } from 'pinia'
import { store } from '../index'
import { type CommonType } from '../model/common'
import type { DictListItem } from '@/api/model'
import type { ApiResponse } from '@/common/http/types'
import { getDictParamData } from '@/api/common'

export const userCommonStore = defineStore({
  id: 'common',
  state: (): CommonType => ({
    onlineState: true,
    cachedRoute: [],
    dictData: {} // 字典集合
  }),
  actions: {
    // 设置网络状态
    setOnlineState(flag: boolean) {
      this.onlineState = flag
    },
    // 设置缓存路由
    setCached(str: string, type?: string) {
      if (type === 'del') {
        this.cachedRoute = this.cachedRoute.filter(
          (item: string) => item !== str
        )
        return false
      }
      if (!this.cachedRoute.some(item => item === str)) {
        this.cachedRoute.push(str)
      }
    },
    setDict(key: string, data: DictListItem[]) {
      this.dictData[key] = data
    },
    getDict(key: string): Promise<DictListItem[]> {
      return new Promise((resolve, reject) => {
        if (!this.dictData[key]) {
          getDictParamData(key).then((result: ApiResponse<DictListItem[]>) => {
            this.setDict(key, result.data)
            resolve(result.data)
          })
        } else {
          resolve(this.dictData[key])
        }
      })
    },
    clearDict() {
      this.dictData = {}
    }
  }
})

export function userCommonStoreHook() {
  return userCommonStore(store)
}
