/**
 * @Desc         : 环境配置信息
 * @Autor        : ZhangYuHang
 * @Date         : 2023-06-05 15:50:01
 * @LastEditors  : ZhangYuHang
 * @LastEditTime : 2023-06-05 15:50:11
 */

export const API = {
  // 开发环境
  development: {
    DEFAULT: import.meta.env.BASE_URL,
    defaultAjaxPath: '/nwmh-webspider'
  },
  // 生产环境
  production: {
    DEFAULT: import.meta.env.BASE_URL,
    defaultAjaxPath: '/jgswappms'
  }
}
const isProd = import.meta.env.MODE === 'production'
export const BASE_CONFIG = isProd ? API.production : API.development
