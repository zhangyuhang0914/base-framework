import { createApp } from 'vue'
import App from './App.vue'
import router from './routers'
import store from './store/common'
// 主子应用对接
import './public-path'
import { micInit, micUnmount } from './mic-api/index'

// vue实例
let instance = null

const renderObj = {
  /**
   * @desc: vue实例函数
   * @param props 非必需，默认app
   * @return {*}
   **/
  render: async (props: any) => {
    const { container } = props
    console.log('props:mic-pc-dispatch', props, container)
    instance = createApp(App)
    // 状态管理器初始化
    instance.use(store)
    // 路由初始化
    instance.use(router)
    await router.isReady()
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
  globalStateFn(props: any) {
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

// 独立运行时
if (!(window as any).__POWERED_BY_QIANKUN__) {
  renderObj.render({})
}

/**
 * bootstrap 只会在微应用初始化的时候调用一次，下次微应用重新进入时会直接调用 mount 钩子，不会再重复触发 bootstrap。
 * 通常我们可以在这里做一些全局变量的初始化，比如不会在 unmount 阶段被销毁的应用级别的缓存等。
 */
export async function bootstrap() {
  console.log('[vue] vue app bootstraped')
}

/**
 * 应用每次进入都会调用 mount 方法，通常我们在这里触发应用的渲染方法
 */
export async function mount(props: any) {
  console.log('mount:mic-pc-dispatch', props)
  renderObj.render(props)
  renderObj.globalStateFn(props)
}

/**
 * 应用每次 切出/卸载 会调用的方法，通常在这里我们会卸载微应用的应用实例
 */
export async function unmount() {
  await micUnmount()
  instance = null
}

/**
 * 可选生命周期钩子，仅使用 loadMicroApp 方式加载微应用时生效
 */
export async function update() {
  console.log('update props')
}
