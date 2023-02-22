/*
 * @Desc         : 配置信息处理
 * @Author       : ZYH
 * @Date         : 2022-04-08 10:32:27
 * @LastEditors  : ZYH
 * @LastEditTime : 2023-02-08 11:11:35
 */

import { App } from 'vue'
import axios from 'axios'
const BASE_URL = import.meta.env.BASE_URL
// 配置存储定义
let config: AnyObject = {}
const setConfig = (cfg?: unknown) => {
  config = Object.assign(config, cfg)
}
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
  return axios.get(`${BASE_URL}config.json?timeStap=${Date.now()}`).then(({ data: config }) => {
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
