import { createApp } from 'vue'
import App from './App.vue'
import router from './routers/index'
import { setupStore } from './stores/index'
import { getConf } from '@/conf/conf'
import elementPlusFn from '@/plugins/element'
import utilsFn from '@/plugins/utils'

const app = createApp(App)

// 获取初始化配置信息
getConf(app).then(async config => {
  app.use(router)
  await router.isReady()
  // 状态管理
  setupStore(app)
  // element-plus挂载
  elementPlusFn(app)
  // 全局工具注册
  utilsFn(app)
  app.mount('#app')
})
