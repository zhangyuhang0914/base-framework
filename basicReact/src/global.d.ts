// * Vite
declare type RecordT<T = any> = Record<string, T>

declare interface ViteEnv {
  NODE_ENV: string
  VITE_API_URL: string
  VITE_ENABLE_VCONSOLE: boolean
  VITE_GLOBAL_APP_TITLE: string
  VITE_HOST: string | boolean
  VITE_PORT: number
  VITE_OPEN: boolean
  VITE_BUILD_GZIP: boolean
  VITE_DROP_CONSOLE: boolean
}
