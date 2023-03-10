/**
 * @Desc         : 系统配置文件
 * @Autor        : ZYH
 * @Date         : 2023-02-13 09:58:06
 * @LastEditors  : ZYH
 * @LastEditTime : 2023-03-08 09:39:05
*/

export const API = {
  // 开发环境
  development: {
    DEFAULT: 'http://192.168.1.246:19601/iframework' || import.meta.env.BASE_URL,
    // JR: 'http://172.16.40.141:8065/iframework' || '/api' // 刘朋
    JR: 'http://192.168.1.246:19601/iframework' || '/api' // 测试环境
    // JR: 'http://192.168.1.246:8080/iframework' || '/api', // 线上环境
  },
  // 生产环境
  production: {
    DEFAULT: 'http://192.168.1.246:19601/iframework' || import.meta.env.BASE_URL,
    JR: 'http://192.168.1.246:19601/iframework' || '/api'
  }
}
const isProd = import.meta.env.MODE === 'production'
export const BASE_CONFIG = isProd ? API.production : API.development
