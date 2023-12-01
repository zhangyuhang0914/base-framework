import { App } from 'vue'

export default (app: App) => {
  // IPC请求通信注入
  app.config.globalProperties.$chrome = chrome
}
