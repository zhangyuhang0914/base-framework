/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
// element-plus eslint
type ComponentSize = any

// Import
interface ImportMeta {
  readonly env: ImportMetaEnv
}

// qs
declare module 'qs'
