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
import { SHA1 } from '@/utils/utils'
import { PROPS_TYPE } from '@/micro/type'
import { startMicros } from '@/micro/index'

const app = createApp(App)
/**
 * 需要传递的一些方法
 */
const props: PROPS_TYPE = {
  SHA1: SHA1
}

// 获取初始化配置信息
getConf(app).then(async (config: any) => {
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
  // 启动微服务
  startMicros(props)
  app.mount('#app')
})
