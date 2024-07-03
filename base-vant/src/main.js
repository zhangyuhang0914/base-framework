import { createApp } from 'vue'
import App from './App.vue'
import router from './routers'
import { setupStore } from './stores/index'
import { getConf } from '@/conf/conf'
import vantFn from '@/plugins/vant'
import '@/plugins/flexible'
import './assets/css/app.styl'

// 创建vue实例
let app = createApp(App)

// 获取初始化配置信息
getConf(app).then(async config => {
  // 挂载router
  app.use(router)
  await router.isReady()
  // 挂载pinia
  setupStore(app)
  // 挂载vant
  vantFn(app)
  app.mount('#app')
})
