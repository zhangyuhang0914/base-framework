/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent, readonly, readonly } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

interface ImportMetaEnv {
  // 项目名称
  readonly VITE_APP_TITLE?: string
  // 环境端口
  readonly VITE_APP_PORT?: string
  // 环境接口
  readonly VITE_APP_DEV_URL?: string
  // API基础路径(反向代理)
  readonly VITE_APP_BASE_API?: string
  // 图片地址
  readonly VITE_APP_IMG_URL?: string
}

// Import
interface ImportMeta {
  readonly env: ImportMetaEnv
}

// qs
declare module 'qs'
