/**
 * 鄂汇办用户相关API类型定义
 */

// 获取登录状态选项类型
export interface getLoginStatusOptions {
  // 是否跳转登录，”1”:是 “0”:不跳转登录页
  jumpToLogin: '1' | '0'
  // 成功回调函数，参数为登录状态（1:已登录,0:未登录）
  success: (res: { loginStatus: '1' | '0' }) => void
}

// 鄂汇办用户接口类型定义
export interface EhbAppUser {
  // 登录
  login: () => void
  // 获取登录状态
  getLoginStatus: (options: getLoginStatusOptions) => void
}
