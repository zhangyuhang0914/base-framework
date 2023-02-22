import { createApp } from 'vue'
import App from './App.vue'
import router from './routers'
import { setupStore } from './store/index'
import { getConf } from '@/conf/conf'
import { injectResponsiveStorage } from '@/utils/storage/responsive'
import { useI18n } from '@/i18n/i18n'
import '@/plugins/flexible'
import elementPlusFn from '@/plugins/element'

// 创建vue实例
const app = createApp(App)

// 获取初始化配置信息
getConf(app).then(async config => {
  // 挂载router
  app.use(router)
  await router.isReady()
  // 默认状态处理
  injectResponsiveStorage(config)
  // 挂载pinia
  setupStore(app)
  // 挂载element
  elementPlusFn(app)
  // i18n国际化
  app.use(useI18n)
  // 挂载实例
  app.mount('#app')
})
