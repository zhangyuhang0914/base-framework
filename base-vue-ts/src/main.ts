import { createApp } from 'vue'
import App from './App.vue'
import router from './routers/index'
import { setupStore } from './stores/index'
import { getConf } from '@/conf/conf'
import { injectResponsiveStorage } from '@/utils/storage/responsive'
import { useI18n } from '@/i18n/i18n'
import '@/plugins/flexible'
import { directivesHook } from '@/directives/index'
import elementPlusFn from '@/plugins/element'

const app = createApp(App)

// 获取初始化配置信息
getConf(app).then(async config => {
  app.use(router)
  await router.isReady()
  // 默认状态处理
  injectResponsiveStorage(config)
  // 状态管理
  setupStore(app)
  elementPlusFn(app)
  app.use(useI18n)
  // 指令
  directivesHook(app)
  app.mount('#app')
})
