/**
 * @Desc         : 配置信息处理
 * @Autor        : ZhangYuHang
 * @Date         : 2023-07-07 11:42:11
 * @LastEditors  : ZhangYuHang
 * @LastEditTime : 2023-07-07 11:45:30
 */
import axios from 'axios'

const BASE_URL = import.meta.env.BASE_URL
// 配置存储定义
let config = {}
const setConfig = cfg => {
  config = Object.assign(config, cfg)
}
// 获取配置
const getConfig = (key, valKey = 'value') => {
  if (key) {
    if (config[key]) {
      return valKey ? config[key][valKey] : config[key]
    } else {
      return ''
    }
  }
  return config
}
// 系统配置
export const getConf = async app => {
  app.config.globalProperties.$config = getConfig()
  return axios
    .get(`${BASE_URL}config.json?timeStap=${Date.now()}`)
    .then(({ data: config }) => {
      let $config = app.config.globalProperties.$config
      // 自动注入项目配置
      if (app && $config && typeof config === 'object') {
        $config = Object.assign($config, config)
        app.config.globalProperties.$config = $config
        app.config.globalProperties.$baseUrl = import.meta.env.BASE_URL
        // 设置全局配置
        setConfig($config)
      }
      return $config
    })
}
export { getConfig, setConfig }
