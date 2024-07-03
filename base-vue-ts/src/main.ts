import { createApp } from 'vue'
import App from './App.vue'
import router from './routers/index'
import { setupStore } from './stores/index'
import { getConf } from '@/conf/conf'
import { directivesHook } from '@/directives/index'
import elementPlusFn from '@/plugins/element'
import '@/plugins/flexible'

const app = createApp(App)

// 获取初始化配置信息
getConf(app).then(async () => {
  app.use(router)
  await router.isReady()
  // 状态管理
  setupStore(app)
  // ElementPlus
  elementPlusFn(app)
  // 指令
  directivesHook(app)
  app.mount('#app')
})
