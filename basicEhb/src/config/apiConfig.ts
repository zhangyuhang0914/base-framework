/**
 * API服务类型枚举
 */
export enum ApiServiceType {
  DEFAULT = 'DEFAULT',
  BASE = 'BASE',
  FILE = 'FILE'
}

/**
 * 环境类型枚举
 */
export enum EnvType {
  DEVELOPMENT = 'development',
  TEST = 'test',
  PRODUCTION = 'production'
}

/**
 * API配置对象，包含不同环境下的各服务基础URL
 */
export const API = {
  // 开发环境
  [EnvType.DEVELOPMENT]: {
    [ApiServiceType.DEFAULT]: import.meta.env.BASE_URL,
    [ApiServiceType.BASE]: import.meta.env.BASE_URL,
    [ApiServiceType.FILE]: import.meta.env.BASE_URL
  },
  // 测试环境
  [EnvType.TEST]: {
    [ApiServiceType.DEFAULT]: import.meta.env.BASE_URL,
    [ApiServiceType.BASE]: import.meta.env.BASE_URL,
    [ApiServiceType.FILE]: import.meta.env.BASE_URL
  },
  // 生产环境
  [EnvType.PRODUCTION]: {
    [ApiServiceType.DEFAULT]: import.meta.env.BASE_URL,
    [ApiServiceType.BASE]: import.meta.env.BASE_URL,
    [ApiServiceType.FILE]: import.meta.env.BASE_URL
  }
}

/**
 * 获取当前环境类型
 */
export const getCurrentEnv = (): EnvType => {
  const mode = import.meta.env.MODE
  switch (mode) {
    case 'production':
      return EnvType.PRODUCTION
    case 'test':
      return EnvType.TEST
    default:
      return EnvType.DEVELOPMENT
  }
}

/**
 * 获取当前环境的API配置
 */
export const getCurrentApiConfig = () => {
  const env = getCurrentEnv()
  return API[env]
}

/**
 * 根据服务类型获取基础URL
 * @param serviceType 服务类型
 */
export const getBaseUrlByService = (
  serviceType: ApiServiceType = ApiServiceType.DEFAULT
): string => {
  const config = getCurrentApiConfig()
  return config[serviceType] || config[ApiServiceType.DEFAULT]
}

/**
 * 当前环境的基础配置
 */
export const CURRENT_ENV = getCurrentEnv()
export const CURRENT_API_CONFIG = getCurrentApiConfig()
