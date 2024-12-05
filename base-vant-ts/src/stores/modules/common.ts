import { defineStore } from 'pinia'
import { store } from '../index'
import { type CommonType } from '../model/common'
import type { DictListItem, EnterpriseInfoType } from '@/api/model'
import type { ApiResponse } from '@/common/http/types'
import { getDictParamData } from '@/api/common'
import { getToken, setToken as setAdminToken } from '@/utils/cookie'
import { storageLocal } from '@/utils/storage'

export const userCommonStore = defineStore({
  id: 'common',
  state: (): CommonType => ({
    onlineState: true,
    cachedRoute: [],
    token: getToken() ?? '', // token
    userId: storageLocal.getItem('USER_ID') ?? '', // 用户id
    enterpriseInfo: storageLocal.getItem('ENTERPRISE_INFO'), // 企业信息
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
        this.cachedRoute = this.cachedRoute.filter((item: string) => item !== str)
        return false
      }
      if (!this.cachedRoute.some(item => item === str)) {
        this.cachedRoute.push(str)
      }
    },
    // 设置token
    setToken(token: string, expire?: number) {
      this.token = token
      setAdminToken(token, expire)
    },
    // 设置用户ID
    setUserId(id: string) {
      this.userId = id
      storageLocal.setItem('USER_ID', id)
    },
    // 设置企业信息
    setEnterpriseInfo(info: EnterpriseInfoType) {
      this.enterpriseInfo = info
      storageLocal.setItem('ENTERPRISE_INFO', info)
    },
    // 设置字典
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
