/*
 * @Desc         : 环境配置信息
 * @Autor        : ZYH
 * @Date         : 2023-02-08 09:58:31
 * @LastEditors  : ZYH
 * @LastEditTime : 2023-02-08 10:39:06
 */
export const API = {
  // 开发环境
  development: {
    DEFAULT: import.meta.env.BASE_URL,
    DEMO: '/jgswappms'
  },
  // 生产环境
  production: {
    DEFAULT: import.meta.env.BASE_URL,
    DEMO: '/jgswappms'
  }
}
const isProd = import.meta.env.MODE === 'production'
export const BASE_CONFIG = isProd ? API.production : API.development
