/*
 * @Des: 环境配置信息
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
// 子应用项目名称，不可随意更改
export const projectName = 'mic-pc-home'
