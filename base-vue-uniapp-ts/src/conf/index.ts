/*
 * @Desc         : 系统配置文件
 * @Autor        : ZhangYuHang
 * @Date         : 2024-04-12 11:37:28
 * @LastEditors  : ZhangYuHang
 * @LastEditTime : 2024-05-21 10:53:59
 */

export const API = {
  // 开发环境
  development: {
    // BASE_URL: 'https://jrb.hubei.gov.cn/szxqyxyxx' || import.meta.env.BASE_URL
    // BASE_URL: 'http://172.16.81.114:8080/webspider-web' // 何鸿飞
    // BASE_URL: 'http://192.168.1.246:9601/webspider-web' // 测试环境
    BASE_URL: 'http://dev.whjr-soft.com:8084/webspider-web' // 临时地址
    // BASE_URL: 'http://172.16.81.156:8081/webspider-web' // 徐凌
  },
  // 生产环境
  production: {
    BASE_URL: 'https://jrb.hubei.gov.cn/szxqyxyxx' || import.meta.env.BASE_URL
  }
}
const isProd = import.meta.env.MODE === 'production'
export const BASE_CONFIG = isProd ? API.production : API.development
