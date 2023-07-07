/**
 * @Desc         : 环境配置信息
 * @Autor        : ZhangYuHang
 * @Date         : 2023-07-07 11:46:31
 * @LastEditors  : ZhangYuHang
 * @LastEditTime : 2023-07-07 11:46:33
 */

export const API = {
  // 开发环境
  development: {
    DEFAULT: import.meta.env.BASE_URL,
    defaultAjaxPath: '/jgfw-webspider'
  },
  // 生产环境
  production: {
    DEFAULT: import.meta.env.BASE_URL,
    defaultAjaxPath: '/jgfw-webspider'
  }
}
const isProd = import.meta.env.MODE === 'production'
export const BASE_CONFIG = isProd ? API.production : API.development
