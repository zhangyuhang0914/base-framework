// * Vite
import type { EhbAppJssdk } from '@/plugin/ehb'

declare global {
  // 全局接口变量：AnyObject
  interface AnyObject {
    [key: string]: any
  }
  // 全局类型：RecordT
  declare type RecordT<T = any> = Record<string, T>
  // 环境变量
  declare interface ViteEnv {
    NODE_ENV: string
    VITE_API_BASE_URL: string
    VITE_ENABLE_VCONSOLE: boolean
    VITE_GLOBAL_APP_TITLE: string
    VITE_GLOBAL_APP_DESCRIPTION: string
    VITE_GLOBAL_APP_KEYWORDS: string
    VITE_GLOBAL_APP_VERSION: string
    VITE_BASE_URL: string
    VITE_HOST: string | boolean
    VITE_PORT: number
    VITE_OPEN: boolean
    VITE_CORE: boolean
    VITE_BUILD_GZIP: boolean
    VITE_DROP_CONSOLE: boolean
  }
  // 鄂汇办JSSDK全局变量
  declare const ehbAppJssdk: EhbAppJssdk
  // 扩展Window接口
  declare global {
    interface Window {
      ehbAppJssdk: EhbAppJssdk
    }
  }
}
