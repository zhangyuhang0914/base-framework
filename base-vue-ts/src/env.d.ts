/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
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
