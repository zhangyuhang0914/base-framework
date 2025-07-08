import enUsTrans from '@/language/modules/en-US'
import zhCnTrans from '@/language/modules/zh-CN'
import i18n from 'i18next'
import { initReactI18next, useTranslation } from 'react-i18next'

/**
 * 语言资源配置对象
 * 结构：{ [语言代码]: { translation: { [键名]: 翻译文本 } } }
 */
const resources = {
  en: {
    translation: enUsTrans
  },
  zh: {
    translation: zhCnTrans
  }
}

/**
 * 初始化i18n实例
 * 使用initReactI18next适配器，让React组件能通过hooks使用国际化功能
 */
const reactEasyI18n = i18n.use(initReactI18next)

/**
 * 配置i18n核心参数
 * @example $t('key')
 * @example reactEasyI18n.changeLanguage('键名')
 */
reactEasyI18n.init({
  resources: resources, // 配置多语言资源
  fallbackLng: 'en', // 选择默认语言，选择内容为上述配置中的 key，即 en/zh
  debug: false, // 开发模式下可设为true，控制台输出调试信息
  interpolation: {
    escapeValue: false, // 告诉 i18next 不需要对值进行转义
    formatSeparator: ',' // 格式化函数的参数分隔符
  }
})

/**
 * 导出简化的翻译函数$t
 * @param key 翻译文本
 * @returns 翻译后的文本
 */
export const $t = (key: string) => {
  const { t } = useTranslation()
  return t(key)
}

export default reactEasyI18n
