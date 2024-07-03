import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { IonicVue } from '@ionic/vue'
import store from './stores/index'
import { getConf } from '@/conf/conf'
import { directivesHook } from '@/directives/index'
import { SplashScreen } from '@capacitor/splash-screen'
import '@/plugins/flexible'
import '@/assets/import-ionic-styl'

const app = createApp(App)
getConf(app).then(async config => {
  app.use(IonicVue)
  app.use(router)
  app.use(store)
  // ionic路由创建后挂载到页面
  app.mount('#app').$nextTick(() => {
    SplashScreen.show({
      autoHide: true, // 是否自动隐藏
      fadeInDuration: 200 // 渐隐动画时长
    })
  })
  router.isReady().then(() => {
    SplashScreen.hide()
  })
  // 指令
  directivesHook(app)
})
