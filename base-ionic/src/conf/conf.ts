/*
 * @Desc         : 配置信息处理
 * @Autor        : ZhangYuHang
 * @Date         : 2023-08-09 17:07:30
 * @LastEditors  : ZhangYuHang
 * @LastEditTime : 2023-08-09 17:46:52
 */
import { App } from 'vue'
import axios from 'axios'
const BASE_URL = import.meta.env.BASE_URL
let config: AnyObject = {}
// 获取配置
const getConfig = (key?: string, valKey: string = 'value') => {
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
export const getConf = async (app: App): Promise<undefined> => {
  app.config.globalProperties.$config = getConfig()
  app.config.globalProperties.$xw = null
  return axios
    .get(`${BASE_URL}config.json?timeStap=${Date.now()}`)
    .then(({ data: config }) => {
      let $config = app.config.globalProperties.$config
      // 自动注入项目配置
      if (app && $config && typeof config === 'object') {
        $config = Object.assign($config, config)
        app.config.globalProperties.$config = $config
        app.config.globalProperties.$baseUrl = import.meta.env.BASE_URL
      }
      return $config
    })
}

export { getConfig }
