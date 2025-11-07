import type { App } from 'vue'

const CONFIG_URL = import.meta.env.VITE_CONFIG_URL
// 配置存储定义
let config: AnyObject = {}
const setConfig = (cfg?: unknown) => {
  config = Object.assign(config, cfg)
}

/**
 * @description 获取配置
 * @returns 配置项value
 */
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

/**
 * @description 系统配置
 * @returns /public/config.json
 */
export const getConf = async (app: App): Promise<undefined> => {
  app.config.globalProperties.$config = getConfig()
  return fetch(`${CONFIG_URL}config/config.json?timeStap=${Date.now()}`)
    .then(res => res.json)
    .then(config => {
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
