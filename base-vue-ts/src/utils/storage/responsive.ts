// 响应式storage
import { storageLocal } from './index'
export const injectResponsiveStorage = (config: any) => {
  storageLocal.setItem('responsive-locale', {
    locale: storageLocal.getItem('responsive-locale')?.locale ?? config.language.value ?? "zh_CN"
  })
}
