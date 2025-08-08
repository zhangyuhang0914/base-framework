/*
 * @Desc         : Store 相关类型定义统一导出
 * @Autor        : ZhangYuHang
 * @Date         : 2024-12-19 17:50:00
 * @LastEditors  : ZhangYuHang
 * @LastEditTime : 2024-12-19 17:50:00
 */

// 用户相关类型
export type {
  UserInfo,
  LoginParams,
  LoginResult,
  UpdateUserInfoParams,
  ChangePasswordParams
} from './user'

export {
  UserStatus,
  UserRole,
  Permission
} from './user'

// 应用设置相关类型
export type {
  ThemeMode,
  LanguageType,
  DeviceType,
  LayoutMode,
  MenuMode,
  AppConfig,
  WindowSize,
  BreakpointConfig,
  ThemeConfig,
  LayoutConfig
} from './app'

export {
  AppStatus,
  TransitionType
} from './app'