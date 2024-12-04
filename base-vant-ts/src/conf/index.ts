/*
 * @Desc         :
 * @Autor        : ZhangYuHang
 * @Date         : 2024-12-03 18:06:07
 * @LastEditors  : ZhangYuHang
 * @LastEditTime : 2024-12-04 09:26:11
 */
export const API = {
  // 开发环境
  development: {
    DEFAULT: import.meta.env.BASE_URL,
    BASE_URL: '/api'
  },
  // 生产环境
  production: {
    DEFAULT: import.meta.env.BASE_URL,
    BASE_URL: '/api'
  }
}
const isProd = import.meta.env.MODE === 'production'
export const BASE_CONFIG = isProd ? API.production : API.development
