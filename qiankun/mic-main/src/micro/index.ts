import { registerMicroApps, addGlobalUncaughtErrorHandler, start } from 'qiankun'
import { getApps } from './apps'

/**
 * @description 添加全局异常捕获
 */
addGlobalUncaughtErrorHandler((event) => {
  console.error(event)
  // const { message: msg } = event
})
