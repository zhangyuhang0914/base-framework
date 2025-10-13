/*
 * @Desc         : 用户相关 API
 * @Autor        : ZhangYuHang
 * @Date         : 2024-12-19 18:00:00
 * @LastEditors  : Please set LastEditors
 * @LastEditTime : 2025-10-13 09:58:31
 */

import { get, post } from '@/common/http/index'
import type {
  UserInfo,
  LoginParams,
  LoginResult,
  UpdateUserInfoParams,
  ChangePasswordParams
} from '@/store/interface'

/**
 * 用户登录
 * @param params 登录参数
 */
export function login(params: LoginParams) {
  return post<LoginResult>('/auth/login', params, {
    showSuccess: true,
    successMessage: '登录成功',
    auth: false // 登录接口不需要认证
  })
}
