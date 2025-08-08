/*
 * @Desc         : 用户状态管理
 * @Autor        : ZhangYuHang
 * @Date         : 2024-12-19 17:45:00
 * @LastEditors  : ZhangYuHang
 * @LastEditTime : 2024-12-19 17:50:00
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type {
  UserInfo,
  LoginParams,
  LoginResult,
  UpdateUserInfoParams,
  ChangePasswordParams
} from '../interface'

// 使用组合式 API 风格定义 store
export const useUserStore = defineStore(
  'user',
  () => {
    // 状态
    const userInfo = ref<UserInfo | null>(null)
    const token = ref<string>('')
    const isLoggedIn = ref<boolean>(false)

    // 计算属性
    const userName = computed(() => userInfo.value?.username || '游客')
    const userRoles = computed(() => userInfo.value?.roles || [])
    const hasRole = computed(() => (role: string) => userRoles.value.includes(role))

    // 方法
    const setUserInfo = (info: UserInfo) => {
      userInfo.value = info
      isLoggedIn.value = true
    }

    const setToken = (newToken: string) => {
      token.value = newToken
    }

    const login = async (loginData: { username: string; password: string }) => {
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
        
        setUserInfo(mockUserInfo)
        setToken('mock-token-' + Date.now())
        
        return { success: true, message: '登录成功' }
      } catch (error) {
        return { success: false, message: '登录失败' }
      }
    }

    const logout = () => {
      userInfo.value = null
      token.value = ''
      isLoggedIn.value = false
    }

    const updateUserInfo = (updates: Partial<UserInfo>) => {
      if (userInfo.value) {
        userInfo.value = { ...userInfo.value, ...updates }
      }
    }

    return {
      // 状态
      userInfo,
      token,
      isLoggedIn,
      // 计算属性
      userName,
      userRoles,
      hasRole,
      // 方法
      setUserInfo,
      setToken,
      login,
      logout,
      updateUserInfo
    }
  },
  {
    // 持久化配置
    persist: {
      // 指定存储的 key
      key: 'user-store',
      // 指定要持久化的状态
      pick: ['userInfo', 'token', 'isLoggedIn'],
      // 可以指定不同的存储方式
      storage: typeof window !== 'undefined' ? localStorage : undefined
    }
  }
)