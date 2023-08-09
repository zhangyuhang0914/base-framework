import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { IonicVue } from '@ionic/vue'
import store from './stores/index'
import { getConf } from '@/conf/conf'
import '@/plugins/flexible'
import '@/assets/import-ionic-styl'

const app = createApp(App)
getConf(app).then(async config => {
  app.use(IonicVue)
  app.use(router)
  app.use(store)
  // ionic路由创建后挂载到页面
  router.isReady().then(() => {
    app.mount('#app')
  })
})
