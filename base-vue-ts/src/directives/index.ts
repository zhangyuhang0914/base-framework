/*
 * @Desc         : 指令
 * @Autor        : ZhangYuHang
 * @Date         : 2024-06-14 10:31:17
 * @LastEditors  : ZhangYuHang
 * @LastEditTime : 2024-06-14 14:27:14
 */

import type { App } from 'vue'
const files: Record<string, any> = import.meta.glob('./*.ts', { eager: true })
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
