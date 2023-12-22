/**
 * @desc: 主子应用交互处理类
 **/
import { getCurrentInstance } from 'vue'

// 主应用传递实例
let micMain = null
let global: any = null

// 主数据初始化
export const micInit = (props: any) => {
  console.log('props', props)
  micMain = props
  global = getCurrentInstance()?.appContext.config.globalProperties
  global.$SHA1 = props.$SHA1
}

/**
 * @desc: 子应用注销调用
 **/
export const micUnmount = () => {
  console.log('子应用注销调用')
}
