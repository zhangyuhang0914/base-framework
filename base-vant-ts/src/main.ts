import { createApp } from 'vue'
import App from './App.vue'
import { getConf } from '@/conf/conf'
import router from './routers/index'
import { setupStore } from '@/stores/index'
import vantPlugins from '@/plugins/vant'
import { directivesHook } from '@/directives/index'
import { SplashScreen } from '@capacitor/splash-screen'
import '@/plugins/flexible'
// 引入css样式
import 'vant/es/toast/style'
import 'vant/es/notify/style'
import 'vant/es/dialog/style'

const app = createApp(App)

getConf(app).then(async config => {
  app.use(router)
  // 状态管理
  setupStore(app)
  // vant加载
  vantPlugins(app)
  // 指令
  directivesHook(app)
  // 初始化应用后，显示 Splash Screen(启动画面)
  app.mount('#app').$nextTick(() => {
    SplashScreen.show({
      autoHide: true, // 是否自动隐藏
      fadeInDuration: 300 // 渐隐动画时长
    })
  })
  // 在应用加载完成后，关闭 Splash Screen
  await router.isReady().then(() => {
    SplashScreen.hide()
  })
})
