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
