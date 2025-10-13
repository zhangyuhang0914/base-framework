import { createApp } from 'vue'
import App from './App.vue'
import { useRouter } from '@/router'
import setupStore from '@/store'
import setupVant from '@/plugin/vant'
import '@/assets/css/app.scss'
import { getConf } from '@/utils/system'
import 'vant/lib/index.css'

const app = createApp(App)

// 获取初始化配置信息
getConf(app).then(async () => {
  // 路由
  useRouter(app)
  // 状态管理
  setupStore(app)
  // Vant 配置
  setupVant(app)
  app.mount('#app')
})
