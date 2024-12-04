/*
 * @Desc         : 指令定义逻辑
 * @Autor        : ZhangYuHang
 * @Date         : 2024-12-03 18:06:07
 * @LastEditors  : ZhangYuHang
 * @LastEditTime : 2024-12-04 10:21:25
 */
import { type App } from 'vue'

const files = import.meta.glob('./*.ts', { eager: true })
const modules: any = {}
for (const key in files) {
  if (Object.prototype.hasOwnProperty.call(files, key)) {
    const moduleKey = key.replace(/(\.\/|\.ts)/g, '')
    modules[moduleKey] = (files as Record<string, any>)[key].default
  }
}
// console.log('modules', modules)

export const directivesHook = (app: App) => {
  for (const key in modules) {
    if (Object.prototype.hasOwnProperty.call(modules, key)) {
      app.directive(key, modules[key])
    }
  }
}
