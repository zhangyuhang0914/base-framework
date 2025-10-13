/*
 * @Author       : 超人
 * @Description  : UnoCSS 类型定义
 * @Date         : 2025-09-10 16:17:28
 * @LastEditTime : 2025-09-10 16:17:28
 */

// 声明虚拟模块类型
declare module 'virtual:uno.css' {}

declare module '@unocss/vite' {
  import { Plugin } from 'vite'
  const UnoCSS: (options?: any) => Plugin
  export default UnoCSS
}

declare module '@unocss/preset-uno' {
  import { Preset } from 'unocss'
  const preset: (options?: any) => Preset
  export default preset
}

declare module '@unocss/preset-attributify' {
  import { Preset } from 'unocss'
  const preset: (options?: any) => Preset
  export default preset
}

declare module '@unocss/preset-icons' {
  import { Preset } from 'unocss'
  const preset: (options?: any) => Preset
  export default preset
}

declare module 'unocss' {
  export function defineConfig(options: any): any
  export interface Preset {
    name?: string
    rules?: any[]
    shortcuts?: any
    theme?: any
    variants?: any
    postprocess?: any[]
    preprocess?: any[]
  }
}
