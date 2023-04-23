/**
 * @Desc         : 环境配置信息
 * @Autor        : ZYH
 * @Date         : 2023-04-23 17:16:53
 * @LastEditors  : ZYH
 * @LastEditTime : 2023-04-23 17:17:44
 */

export const API = {
  // 开发环境
  development: {
    DEFAULT: import.meta.env.BASE_URL,
    JR: '/web-spider'
  },
  // 生产环境
  production: {
    DEFAULT: import.meta.env.BASE_URL,
    JR: '/web-spider'
  }
}
const isProd = import.meta.env.MODE === 'production'
export const BASE_CONFIG = isProd ? API.production : API.development
