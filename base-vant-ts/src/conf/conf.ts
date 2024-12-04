/*
 * @Desc         : 配置文件
 * @Autor        : ZhangYuHang
 * @Date         : 2024-12-03 18:06:07
 * @LastEditors  : ZhangYuHang
 * @LastEditTime : 2024-12-04 10:38:33
 */

import { type App } from 'vue'
import axios from 'axios'
const BASE_URL = import.meta.env.BASE_URL
// 配置存储定义
const config: AnyObject = {}
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

export const getConf = async (app: App): Promise<undefined> => {
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
      }
      return $config
    })
}

export { getConfig }
