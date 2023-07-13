import { ipcRenderer } from 'electron'
const Store = require('electron-store')
// import Store from 'electron-store'
import validate from '@/utils/validate'
import * as $utils from '@/utils/utils'

export default app => {
  // IPC请求通信注入
  app.config.globalProperties.$ipcRenderer = ipcRenderer
  // electron-store 缓存注入
  const electronStore = new Store()
  app.config.globalProperties.$electronStore = electronStore
  // 校验规则注入
  app.config.globalProperties.$validate = validate
  // 工具注入
  app.config.globalProperties.$utils = $utils
}
