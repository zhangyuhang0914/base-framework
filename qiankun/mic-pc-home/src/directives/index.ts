/*
 * @Desc         : 指令定义逻辑
 * @Autor        : ZhangYuHang
 * @Date         : 2023-08-14 14:59:06
 * @LastEditors  : ZhangYuHang
 * @LastEditTime : 2023-10-07 15:00:18
 */
import { App } from 'vue'
const files: Record<string, any> = import.meta.globEager('./*.ts')
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
