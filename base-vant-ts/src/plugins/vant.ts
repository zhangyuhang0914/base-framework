import { Notify, Toast, setNotifyDefaultOptions } from 'vant'
import { App } from 'vue'
export default (app: App) => {
  app.use(Notify)
  app.use(Toast)

  // 修改 notify 默认配置
  setNotifyDefaultOptions({
    duration: 1500
  })
}
