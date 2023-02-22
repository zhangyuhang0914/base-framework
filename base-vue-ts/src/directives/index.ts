/*
 * @Desc         : 指令
 * @Autor        : ZYH
 * @Date         : 2023-02-08 10:00:46
 * @LastEditors  : ZYH
 * @LastEditTime : 2023-02-08 10:39:56
 */

const files = import.meta.globEager('./*.ts')
const modules: any = {};
for (const key in files) {
  if (Object.prototype.hasOwnProperty.call(files, key)) {
     modules[key.replace(/(\.\/|\.ts)/g, '')] = files[key].default
  }
}
console.log(modules)

export const directivesHook = (app:any) => {
  for(const key in modules) {
    if (Object.prototype.hasOwnProperty.call(modules, key)) {
      app.directive(key, modules[key])
   }
  }
}
