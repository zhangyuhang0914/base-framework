/*
 * @Desc         : 环境配置信息
 * @Autor        : ZhangYuHang
 * @Date         : 2023-08-17 16:45:28
 * @LastEditors  : ZhangYuHang
 * @LastEditTime : 2023-08-23 10:05:13
 */

export const API = {
  // 开发环境
  development: {
    DEFAULT: import.meta.env.BASE_URL,
    defaultAjaxPath: '/webspiderweb'
  },
  // 生产环境
  production: {
    DEFAULT: import.meta.env.BASE_URL,
    defaultAjaxPath: '/webspiderweb'
  }
}

const isProd = import.meta.env.MODE === 'production'
export const BASE_CONFIG = isProd ? API.production : API.development
