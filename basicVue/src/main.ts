import { createApp } from 'vue'
import App from './App.vue'
import { useI18n } from '@/language'
import { useRouter } from '@/router'
import setupStore from '@/store'
import setupAntDesignVue from '@/plugin/antDesign'
import '@/assets/css/app.scss'
import { getConf } from '@/utils/system'
// 导入unocss样式
import 'virtual:uno.css'

const app = createApp(App)

// 获取初始化配置信息
getConf(app).then(async () => {
  // 路由
  useRouter(app)
  // 状态管理
  setupStore(app)
  // Ant Design Vue
  setupAntDesignVue(app)
  // 使用 Vue I18n
  useI18n(app)
  app.mount('#app')
})
