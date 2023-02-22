import { createSSRApp } from "vue"
import App from "./App.vue"
import { setupStore } from './stores/index'
import uviewPlusFn from '@/plugins/uview'
import mpShare from "@/utils/share.js"
import * as $utils from '@/utils/utils'

export function createApp () {
  const app = createSSRApp(App)
  // 全局工具注册
  app.config.globalProperties.$utils = $utils
  // console.log('app', app, app.config.globalProperties.$utils)
  // 分享
  app.mixin(mpShare)
  // 调用setConfig方法，方法内部会进行对象属性深度合并
  // uni.$u.setConfg({
  //   config: {
  //     unit: 'rpx',
  //     baseUrl: '', // 正式环境
  //   }
  // })
  // 挂载pinia
  setupStore(app)
  // 挂载uviewPlus
  uviewPlusFn(app)
  return {
    app,
  }
}
