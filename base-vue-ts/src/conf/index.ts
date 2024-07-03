/*
 * @Desc         : 环境配置信息
 * @Autor        : ZYH
 * @Date         : 2023-02-08 09:58:31
 * @LastEditors  : ZhangYuHang
 * @LastEditTime : 2024-06-14 11:37:18
 */
export const API = {
  // 开发环境
  development: {
    BASE_URL: import.meta.env.BASE_URL,
    JR: '/webspider-web'
  },
  // 生产环境
  production: {
    BASE_URL: import.meta.env.BASE_URL,
    JR: '/webspider-web'
  }
}
const isProd = import.meta.env.MODE === 'production'
export const BASE_CONFIG = isProd ? API.production : API.development
