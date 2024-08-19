/*
 * @Desc         : 环境配置信息
 * @Autor        : ZYH
 * @Date         : 2024-07-09 13:53:34
 * @LastEditors  : ZhangYuHang
 * @LastEditTime : 2024-08-19 10:48:29
 */
export const API = {
  // 开发环境
  development: {
    DEFAULT: import.meta.env.BASE_URL,
    BASE_URL: '/webspider-web'
  },
  // 生产环境
  production: {
    DEFAULT: import.meta.env.BASE_URL,
    BASE_URL: '/webspider-web'
  }
}
const isProd = import.meta.env.MODE === 'production'
export const BASE_CONFIG = isProd ? API.production : API.development
