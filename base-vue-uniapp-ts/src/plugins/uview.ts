import uviewPlus from 'uview-plus'
import type { App } from 'vue'

export const $toast = (message: string) => {
  uni.$u.toast(message)
}

export default (app: App<Element>) => {
  app.provide('$toast', $toast)
  app.use(uviewPlus)
}
