import { createApp } from 'vue'
import App from './App.vue'
import router from './routers'
import { setupStore } from './store/index'
import { getConf } from '@/conf/conf'
import { injectResponsiveStorage } from '@/utils/storage/responsive'
import utilsFn from '@/plugins/utils'
import '@/plugins/flexible'
// 引入主题
import '@/assets/theme/index.css'
import elementPlusFn from '@/plugins/element'
import { install as VueMonacoEditorPlugin } from '@guolao/vue-monaco-editor'
import * as monaco from 'monaco-editor'
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'

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
  // 全局工具注册
  utilsFn(app)
  app.use(VueMonacoEditorPlugin, {
    paths: {
      // The recommended CDN config
      vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.43.0/min/vs'
    }
  })
  // 挂载实例
  app.mount('#app')
  self.MonacoEnvironment = {
    // eslint-disable-next-line prettier/prettier
    getWorker (_, label) {
      if (label === 'json') {
        return new jsonWorker()
      }
      if (label === 'css' || label === 'scss' || label === 'less') {
        return new cssWorker()
      }
      if (label === 'html' || label === 'handlebars' || label === 'razor') {
        return new htmlWorker()
      }
      if (label === 'typescript' || label === 'javascript') {
        return new tsWorker()
      }
      return new editorWorker()
    }
  }
})
