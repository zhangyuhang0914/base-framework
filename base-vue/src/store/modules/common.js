import { defineStore } from 'pinia'
import { store } from '../index'

export const userCommonStore = defineStore({
  id: 'common',
  state: () => {
    return {
      name: '张宇航',
      token: ''
    }
  },
  actions: {
    updateName (name) {
      this.name = name
    },
    setToken (token) {
      this.token = token
    }
  },
  persist: {
    // 开启持久化存储
    enabled: true,
    // 自定义持久化参数
    strategies: [
      {
        // 自定义key,默认就是仓库的key
        key: 'token',
        // 自定义存储方式，默认sessionStorage
        storage: localStorage,
        // 指定要持久化的数据，默认所有 state 都会进行缓存，可以通过 paths 指定要持久化的字段，其他的则不会进行持久化。
        paths: ['token']
      }
    ]
  }
})

export function userCommonStoreHook () {
  return userCommonStore(store)
}
