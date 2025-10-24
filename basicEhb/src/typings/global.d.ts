// * Vite
import type { EhbAppJssdk } from '@/plugin/ehb'

// 扩展全局作用域
declare global {
  // 全局接口变量：AnyObject
  interface AnyObject {
    [key: string]: any
  }
  // 鄂汇办JSSDK全局变量
  const ehbAppJssdk: EhbAppJssdk
  // 扩展Window接口
  interface Window {
    ehbAppJssdk: EhbAppJssdk
    // 天地图全局变量
    T: any
  }
}

export {}
