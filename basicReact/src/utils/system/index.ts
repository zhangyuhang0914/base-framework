/*
 * @Author       : 超人
 * @Description : 授人以渔，功德无量，利在千秋
 * @Date         : 2025-07-07 17:40:50
 * @LastEditTime : 2025-07-07 17:45:04
 */

/**
 * @description 处理env配置项非法字符
 * @param {Object} envConf 当前访问地址
 * @returns object
 * @example loadEnvConf(process.env)
 * 注: env环境变量默认获取的是字符串，通过 loadEnvConf 处理为正确的类型
 */
export function loadEnvConf(envConf: RecordT): ViteEnv {
  const ret: any = {}
  for (const envName of Object.keys(envConf)) {
    let realName = envConf[envName].replace(/\\n/g, '\n')
    realName =
      realName === 'true' ? true : realName === 'false' ? false : realName
    if (envName === 'VITE_PORT') {
      realName = Number(realName)
    }
    ret[envName] = realName
    process.env[envName] = realName
  }
  return ret
}
