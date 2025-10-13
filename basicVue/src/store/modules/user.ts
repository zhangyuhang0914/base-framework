/*
 * @Desc         : 用户状态管理
 * @Autor        : 超人
 * @Date         : 2025-08-08 18:04:14
 * @LastEditors  : Please set LastEditors
 * @LastEditTime : 2025-09-03 14:49:28
 */

import { defineStore } from 'pinia'
import type { UserInfo } from '../interface'
import { piniaStore as store } from '@/store'

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: null as UserInfo | null,
    token: '',
    isLoggedIn: false
  }),
  getters: {
    userName: (state) => state.userInfo?.username || '游客',
    userRoles: (state) => state.userInfo?.roles || [],
    hasRole: (state) => {
      return (role: string) => state.userInfo?.roles?.includes(role) || false
    }
  },
  actions: {
    setUserInfo(info: UserInfo) {
      this.userInfo = info
      this.isLoggedIn = true
    },
    setToken(newToken: string) {
      this.token = newToken
    },
    async login(loginData: { username: string; password: string }) {
      try {
        // 这里应该调用登录 API
        // const response = await loginApi(loginData)
        // 模拟登录成功
        const mockUserInfo: UserInfo = {
          id: 1,
          username: loginData.username,
          email: `${loginData.username}@example.com`,
          roles: ['user']
        }
        this.setUserInfo(mockUserInfo)
        this.setToken('mock-token-' + Date.now())
        return { success: true, message: '登录成功' }
      } catch (error) {
        return { success: false, message: '登录失败' }
      }
    },
    logout() {
      this.userInfo = null
      this.token = ''
      this.isLoggedIn = false
    },
    updateUserInfo(updates: Partial<UserInfo>) {
      if (this.userInfo) {
        this.userInfo = { ...this.userInfo, ...updates }
      }
    }
  },
  // 持久化存储 开启数据缓存
  persist: {
    key: 'user-store', // 存储key
    storage: localStorage, // 存储方式
    pick: ['userInfo', 'token', 'isLoggedIn'] // 需要存储的字段
  }
})

export function useUserStoreHook() {
  return useUserStore(store)
}
