/*
 * @Author       : 超人
 * @Description : 授人以渔，功德无量，利在千秋
 * @Date         : 2025-07-07 17:40:50
 * @LastEditTime : 2025-08-07 17:44:07
 */

import type { LanguageKey } from '@/language/interface'
import type { App } from 'vue'
import { get } from '@/common/http/api'

const BASE_URL = import.meta.env?.VITE_API_BASE_URL || ''
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
  return get(`${BASE_URL}config.json?timeStap=${Date.now()}`).then(config => {
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

/**
 * @description 获取浏览器默认语言
 * @return string
 */
export const getBrowserLang = (): LanguageKey => {
  let browserLang = navigator.language
  let defaultBrowserLang: LanguageKey = 'zh'
  if (
    browserLang.toLowerCase() === 'cn' ||
    browserLang.toLowerCase() === 'zh' ||
    browserLang.toLowerCase() === 'zh-cn'
  ) {
    defaultBrowserLang = 'zh'
  } else {
    defaultBrowserLang = 'en'
  }
  return defaultBrowserLang
}
