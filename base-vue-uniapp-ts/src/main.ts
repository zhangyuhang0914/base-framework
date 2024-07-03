import { createSSRApp } from 'vue'
import { setupStore } from '@/store/index'
import uviewPlusFn from '@/plugins/uview'
import App from './App.vue'
export function createApp() {
  const app = createSSRApp(App)
  // 挂载pinia
  setupStore(app)
  // 挂载uviewPlus
  uviewPlusFn(app)
  return {
    app
  }
}
