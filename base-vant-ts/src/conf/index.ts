/*
 * @Desc         : 环境配置信息
 * @Autor        : ZhangYuHang
 * @Date         : 2023-08-17 16:45:28
 * @LastEditors  : ZhangYuHang
 * @LastEditTime : 2023-08-17 16:47:58
 */

export const API = {
  // 开发环境
  development: {
    DEFAULT: import.meta.env.BASE_URL,
    API: '/iframework/'
  },
  // 生产环境
  production: {
    DEFAULT: import.meta.env.BASE_URL,
    API: '/iframework/'
  }
}

const isProd = import.meta.env.MODE === 'production'
export const BASE_CONFIG = isProd ? API.production : API.development
