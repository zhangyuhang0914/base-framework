import { createApp } from 'vue'
import App from './App.vue'
import router from './routers/index'
import { setupStore } from './stores/index'
import { useI18n } from '@/i18n/i18n'
import '@/plugins/flexible'
import { directivesHook } from '@/directives/index'
import elementPlusFn from '@/plugins/element'
// 主子应用对接
import { renderWithQiankun, qiankunWindow } from 'vite-plugin-qiankun/dist/helper'
import './public-path'
import { micInit, micUnmount } from './mic-api/index'

// vue实例
let instance = null
const renderObj = {
  // 状态管理器
  store: null,
  /**
   * @desc: vue实例函数
   * @param props 非必需，默认app
   * @return {*}
   **/
  async render(props: any) {
    const { container } = props
    console.log('props', props, container)
    instance = createApp(App)
    // 路由初始化
    instance.use(router)
    await router.isReady()
    // 状态管理
    setupStore(instance)
    elementPlusFn(instance)
    instance.use(useI18n)
    // 指令
    directivesHook(instance)
    instance.mount(container ? container.querySelector('#app') : '#app')
    // 判断是否是微前端环境
    if ((window as any).__POWERED_BY_QIANKUN__) {
      // 子应用初始化
      micInit(props)
    }
  },
  /**
   * @desc: 微应用事件接收处理
   * @param {*} props
   * @return {*}
   **/
  globalStateFn(props: any = {}) {
    props &&
      props.onGlobalStateChange &&
      props.onGlobalStateChange(
        /**
         * 接收主应用 setGlobalState
         * @param {*} value 传过来的值
         * @param {*} prev 改变以前的值
         */
        (value: any, prev: any) => {
          console.log('onGlobalStateChange', value, prev)
        },
        true
      )
  }
}
/**
 * bootstrap：bootstrap 只会在微应用初始化的时候调用一次，下次微应用重新进入时会直接调用 mount 钩子，不会再重复触发 bootstrap。
 *            通常我们可以在这里做一些全局变量的初始化，比如不会在 unmount 阶段被销毁的应用级别的缓存等。
 * mount：应用每次进入都会调用 mount 方法，通常我们在这里触发应用的渲染方法
 * unmount：应用每次 切出/卸载 会调用的方法，通常在这里我们会卸载微应用的应用实例
 */
renderWithQiankun({
  bootstrap: async () => {
    console.log('[vue] vue app bootstraped')
  },
  mount: (props: any) => {
    renderObj.render(props)
  },
  unmount: async () => {
    await micUnmount()
    renderObj.store = null
    // instance.$destroy()
    instance = null
  },
  update: () => {
    console.log('update')
  }
})

// 独立运行时，直接挂载应用
if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  renderObj.render({})
}
