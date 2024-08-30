import { registerMicroApps, addGlobalUncaughtErrorHandler, start } from 'qiankun'
import { getApps } from './apps'
import { PROPS_TYPE } from '@/micro/type'

/**
 * @description 添加全局异常捕获
 */
addGlobalUncaughtErrorHandler((event: any) => {
  console.error(event)
  const { message } = event
  if (message && message.includes('died in status LOADING_SOURCE_CODE')) {
    // message.error('微应用加载失败，请检查应用是否可运行')
    console.error('微应用加载失败，请检查应用是否可运行')
  } else {
    console.error(message)
  }
})

/**
 * 开始加载子程序
 * @param {*} props 默认需要传递的一些属性
 */
export function startMicros(props: PROPS_TYPE) {
  const apps = getApps(props)
  console.log('startMicros', apps)
  registerMicroApps(apps, {
    /**
     * @description 应用加载之前
     * @param {*} app
     */
    beforeLoad: (app: any) => {
      console.log('beforeLoad', app)
      // NProgress.start()
      return Promise.resolve()
    },
    /**
     * @description 微应用挂载之后
     * @param {*} app
     */
    afterMount: (app: any) => {
      console.log('afterMount', app)
      // NProgress.done()
      return Promise.resolve()
    },
    /**
     * @description 微应用卸载之后
     * @param {*} app
     */
    afterUnmount: (app: any) => {
      console.log('after unmount', app.name)
      return Promise.resolve()
    }
  })
  start({
    prefetch: 'all',
    sandbox: {
      experimentalStyleIsolation: true // 开启沙箱样式隔离
    }
  })
}
