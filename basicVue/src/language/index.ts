import type { LanguageKey } from '@/language/interface'
import enUsTrans from '@/language/modules/en-US'
import zhCnTrans from '@/language/modules/zh-CN'
import type { App } from 'vue'
import { createI18n } from 'vue-i18n'

/**
 * 语言资源配置对象
 * 结构：{ [语言代码]: { [键名]: 翻译文本 } }
 */
const messages = {
  en: enUsTrans,
  zh: zhCnTrans
}

/**
 * 创建Vue3 i18n实例
 * 使用vue-i18n，让Vue组件能通过组合式API使用国际化功能
 */
const i18n = createI18n({
  legacy: false, // 使用组合式API模式
  locale: 'zh', // 设置默认语言
  fallbackLocale: 'en', // 选择默认语言，选择内容为上述配置中的 key，即 en/zh
  messages: messages, // 配置多语言资源
  globalInjection: true, // 全局注入$t函数
  silentTranslationWarn: true, // 禁用翻译警告
  silentFallbackWarn: true // 禁用回退警告
})

/**
 * 导出简化的翻译函数$t
 * @param key 翻译文本键名
 * @param params 插值参数
 * @returns 翻译后的文本
 */
export const $t = (key: string, params?: Record<string, any>) => {
  return params ? i18n.global.t(key, params) : i18n.global.t(key)
}

/**
 * 切换语言
 * @param lang 语言代码
 */
export const changeLanguage = (lang: LanguageKey) => {
  i18n.global.locale.value = lang
}

/**
 * 获取当前语言
 * @returns 当前语言代码
 */
export const getCurrentLanguage = (): LanguageKey => {
  return i18n.global.locale.value as LanguageKey
}

/**
 * 获取所有可用语言
 * @returns 可用语言列表
 */
export const getAvailableLanguages = (): LanguageKey[] => {
  return Object.keys(messages) as LanguageKey[]
}

export function useI18n(app: App<Element>) {
  app.use(i18n)
}

export { i18n }
