/*
 * @Desc         : 用户相关 API
 * @Autor        : ZhangYuHang
 * @Date         : 2024-12-19 18:00:00
 * @LastEditors  : Please set LastEditors
 * @LastEditTime : 2025-08-07 16:39:59
 */

import { get, post, put, delete as del, getPage } from '@/common/http/index'
import type {
  UserInfo,
  LoginParams,
  LoginResult,
  UpdateUserInfoParams,
  ChangePasswordParams
} from '@/store/interface'
import type { PaginationParams } from '@/common/interface/http'

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

/**
 * 用户退出登录
 */
export function logout() {
  return post(
    '/auth/logout',
    {},
    {
      showSuccess: true,
      successMessage: '退出成功'
    }
  )
}

/**
 * 获取用户信息
 */
export function getUserInfo() {
  return get<UserInfo>(
    '/user/info',
    {},
    {
      loading: false // 不显示全局加载状态
    }
  )
}

/**
 * 更新用户信息
 * @param params 更新参数
 */
export function updateUserInfo(params: UpdateUserInfoParams) {
  return put<UserInfo>('/user/info', params, {
    showSuccess: true,
    successMessage: '更新成功'
  })
}

/**
 * 修改密码
 * @param params 修改密码参数
 */
export function changePassword(params: ChangePasswordParams) {
  return post('/user/change-password', params, {
    showSuccess: true,
    successMessage: '密码修改成功'
  })
}

/**
 * 获取用户列表（分页）
 * @param params 分页参数
 */
export function getUserList(params: PaginationParams) {
  return getPage<UserInfo>('/user/list', params)
}

/**
 * 创建用户
 * @param params 用户信息
 */
export function createUser(params: Omit<UserInfo, 'id'>) {
  return post<UserInfo>('/user', params, {
    showSuccess: true,
    successMessage: '用户创建成功'
  })
}

/**
 * 更新用户
 * @param id 用户ID
 * @param params 用户信息
 */
export function updateUser(id: string | number, params: Partial<UserInfo>) {
  return put<UserInfo>(`/user/${id}`, params, {
    showSuccess: true,
    successMessage: '用户更新成功'
  })
}

/**
 * 删除用户
 * @param id 用户ID
 */
export function deleteUser(id: string | number) {
  return del(`/user/${id}`, {
    showSuccess: true,
    successMessage: '用户删除成功'
  })
}

/**
 * 批量删除用户
 * @param ids 用户ID数组
 */
export function batchDeleteUsers(ids: (string | number)[]) {
  return post(
    '/user/batch-delete',
    { ids },
    {
      showSuccess: true,
      successMessage: '批量删除成功'
    }
  )
}

/**
 * 重置用户密码
 * @param id 用户ID
 */
export function resetUserPassword(id: string | number) {
  return post(
    `/user/${id}/reset-password`,
    {},
    {
      showSuccess: true,
      successMessage: '密码重置成功'
    }
  )
}

/**
 * 启用/禁用用户
 * @param id 用户ID
 * @param status 用户状态
 */
export function toggleUserStatus(id: string | number, status: 'active' | 'inactive') {
  return put(
    `/user/${id}/status`,
    { status },
    {
      showSuccess: true,
      successMessage: status === 'active' ? '用户已启用' : '用户已禁用'
    }
  )
}
