// 国际化
import { storageLocal } from '@/utils/storage'
import { createI18n } from 'vue-i18n'
let languageModule = import.meta.globEager(`./language/*.js`)

let language = {}
Object.values(languageModule).forEach(item => {
  Object.keys(item).forEach(lanName => {
    language[lanName] = item[lanName]
  })
})

export const localesConfigs = {
  ...language
}

// 此函数只是配合i18n Ally插件来进行国际化智能提示，并无实际意义（只对提示起作用），如果不需要国际化可删除
export const $t = Key => key

// console.log(storageLocal.getItem("responsive-locale")?.locale)
export const i18n = createI18n({
  legacy: false,
  locale: storageLocal.getItem('responsive-locale')?.locale ?? 'en',
  globalInjection: true,
  // fallbackLocale: "en",
  messages: localesConfigs,
  silentTranslationWarn: true
  // silentFallbackWarn: true
})

export function useI18n(app) {
  app.use(i18n)
}
