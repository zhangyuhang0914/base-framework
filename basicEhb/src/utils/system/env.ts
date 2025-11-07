export type RecordT<T = any> = Record<string, T>
export interface ViteEnv {
  // 环境变量
  NODE_ENV: string
  // 请求基础路径
  VITE_API_BASE_URL: string
  VITE_ENABLE_VCONSOLE: boolean
  VITE_GLOBAL_APP_TITLE: string
  VITE_GLOBAL_APP_DESCRIPTION: string
  VITE_GLOBAL_APP_KEYWORDS: string
  VITE_GLOBAL_APP_VERSION: string
  VITE_BASE_URL: string
  VITE_BUILD_OUT_DIR: string
  VITE_HOST: string | boolean
  VITE_PORT: number
  VITE_OPEN: boolean
  VITE_CORE: boolean
  VITE_BUILD_GZIP: boolean
  VITE_DROP_CONSOLE: boolean
}

/**
 * @description 加载环境变量配置
 * @param envConf 环境变量对象
 * @returns 处理后的环境变量配置
 */
export function loadEnvConf(envConf: RecordT): ViteEnv {
  const ret: any = {}
  for (const envName of Object.keys(envConf)) {
    let realName = envConf[envName].replace(/\\n/g, '\n')
    realName = realName === 'true' ? true : realName === 'false' ? false : realName
    if (envName === 'VITE_PORT') {
      realName = Number(realName)
    }
    if (envName === 'VITE_PROXY') {
      try {
        realName = JSON.parse(realName)
      } catch (error) {
        console.error('VITE_PROXY 配置解析失败:', error)
        realName = []
      }
    }
    ret[envName] = realName
  }
  return ret
}
