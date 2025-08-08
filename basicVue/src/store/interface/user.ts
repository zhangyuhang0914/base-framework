/*
 * @Desc         : 用户状态管理相关类型定义
 * @Autor        : ZhangYuHang
 * @Date         : 2024-12-19 17:50:00
 * @LastEditors  : ZhangYuHang
 * @LastEditTime : 2024-12-19 17:50:00
 */

// 用户信息接口
export interface UserInfo {
  id: string | number
  username: string
  nickname?: string
  email?: string
  phone?: string
  avatar?: string
  roles: string[]
  permissions?: string[]
  department?: string
  position?: string
  createTime?: string
  lastLoginTime?: string
  status?: 'active' | 'inactive' | 'locked'
}

// 登录请求参数
export interface LoginParams {
  username: string
  password: string
  captcha?: string
  rememberMe?: boolean
}

// 登录响应结果
export interface LoginResult {
  success: boolean
  message: string
  data?: {
    token: string
    refreshToken?: string
    userInfo: UserInfo
    expiresIn?: number
  }
}

// 更新用户信息参数
export interface UpdateUserInfoParams {
  nickname?: string
  email?: string
  phone?: string
  avatar?: string
  department?: string
  position?: string
}

// 修改密码参数
export interface ChangePasswordParams {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}

// 用户状态枚举
export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  LOCKED = 'locked'
}

// 用户角色枚举
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest',
  MANAGER = 'manager',
  DEVELOPER = 'developer'
}

// 权限枚举
export enum Permission {
  READ = 'read',
  WRITE = 'write',
  DELETE = 'delete',
  ADMIN = 'admin',
  MANAGE_USERS = 'manage_users',
  MANAGE_ROLES = 'manage_roles',
  MANAGE_PERMISSIONS = 'manage_permissions'
}