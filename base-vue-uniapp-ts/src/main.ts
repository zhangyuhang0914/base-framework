import { createSSRApp } from 'vue'
import { setupStore } from '@/store/index'
import uviewPlusFn from '@/plugins/uview'
import UniShare from '@/util/share'
import App from './App.vue'
export function createApp() {
  const app = createSSRApp(App)
  // 挂载pinia
  setupStore(app)
  // 挂载uviewPlus
  uviewPlusFn(app)
  // 小程序分享
  // @ts-ignore
  app.mixin(UniShare)
  return {
    app
  }
}
