/**
 * @Desc         : 系统配置文件
 * @Autor        : ZYH
 * @Date         : 2023-02-13 09:58:06
 * @LastEditors  : ZYH
 * @LastEditTime : 2023-02-13 09:58:27
*/

export const API = {
  // 开发环境
  development: {
    DEFAULT: import.meta.env.BASE_URL,
    DEMO: '/api/'
  },
  // 生产环境
  production: {
    DEFAULT: import.meta.env.BASE_URL,
    DEMO: '/api'
  }
}
const isProd = import.meta.env.MODE === 'production'
export const BASE_CONFIG = isProd ? API.production : API.development
