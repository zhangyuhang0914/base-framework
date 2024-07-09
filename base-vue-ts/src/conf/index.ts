/*
 * @Desc         : 环境配置信息
 * @Autor        : ZYH
 * @Date         : 2024-07-09 13:53:34
 * @LastEditors  : ZhangYuHang
 * @LastEditTime : 2024-07-09 13:53:34
 */
export const API = {
  // 开发环境
  development: {
    DEFAULT: import.meta.env.BASE_URL,
    BASE_URL: '/szxqyxyxx'
  },
  // 生产环境
  production: {
    DEFAULT: import.meta.env.BASE_URL,
    BASE_URL: '/szxqyxyxx'
  }
}
const isProd = import.meta.env.MODE === 'production'
export const BASE_CONFIG = isProd ? API.production : API.development
