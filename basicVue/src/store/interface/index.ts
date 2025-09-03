/*
 * @Desc         : Store 相关类型定义统一导出
 * @Autor        : ZhangYuHang
 * @Date         : 2024-12-19 17:50:00
 * @LastEditors  : Please set LastEditors
 * @LastEditTime : 2025-08-08 17:56:44
 */

// 用户相关类型
export type {
  UserInfo,
  LoginParams,
  LoginResult,
  UpdateUserInfoParams,
  ChangePasswordParams
} from './user'

export { UserStatus, UserRole, Permission } from './user'

// Global 相关类型
export type { GlobalState } from './global'
