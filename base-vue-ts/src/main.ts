import { createApp } from 'vue'
import App from './App.vue'
import router from './routers/index'
import { setupStore } from './stores/index'
import { getConf } from '@/conf/conf'
import { injectResponsiveStorage } from '@/utils/storage/responsive'
import { useI18n } from '@/i18n/i18n'
import '@/plugins/flexible'
import { directivesHook } from '@/directives/index'
import elementPlusFn from '@/plugins/element'
import { defaultTheme } from './test'

const app = createApp(App)

console.log(import.meta)
// 获取初始化配置信息
getConf(app).then(async config => {
  app.use(router)
  // await router.isReady()
  // 默认状态处理
  injectResponsiveStorage(config)
  // 状态管理
  setupStore(app)
  elementPlusFn(app)
  // 指令
  directivesHook(app)
  app.use(useI18n)
  app.mount('#app')
})

defaultTheme(app).then(async conf => {
  // 基础接口
  interface LabelledValue {
    readonly size: number // 只读属性
    label: string // 基础属性（必须）
    width?: number // 可选属性
    color?: string
  }
  function printLabel(config: LabelledValue): { color: string; area: number } {
    let newLabelledValue = {
      color: 'white',
      area: 200
    }
    console.log('config', config, config.color)

    if (config.color) {
      newLabelledValue.color = config.color
    }
    if (config.width) {
      newLabelledValue.area = config.width * config.width
    }
    return newLabelledValue
  }
  let myObject = {
    size: 10,
    label: 'size 10 object',
    width: 20,
    color: 'black'
  }
  let newPrintLabel = printLabel(myObject)
  // console.log('newPrintLabel', newPrintLabel)

  // 函数接口
  interface SearchFunc {
    (source: string, subString: string): boolean
  }
  // 赋值值类型
  let mySearch: SearchFunc
  mySearch = function (source: string, subString: string): boolean {
    let result = source.search(subString)
    // console.log('mySearch', result, source, subString)
    return result > -1 // 逐个检查函数属性的类型
  }

  // 可索引接口
  interface StringObj {
    [porpNmae: number]: boolean
    [porpNmae: string]: boolean
  }
  let myObj: StringObj
  myObj = {
    1: false,
    a: true
  }
  let myStr: boolean = myObj['a']
  // console.log('可索引接口', myStr)

  // 类类型接口
  interface ClockConstructor {
    new (hour: number, minute: number): ClockInterface
  }
  interface ClockInterface {
    tick()
  }
  function createClock(ctor: ClockConstructor, hour: number, minute: number): ClockInterface {
    return new ctor(hour, minute)
  }
  class DiaitalClock implements ClockInterface {
    constructor(h: number, m: number) {}
    tick() {
      console.log('beep bepp')
    }
  }
  class AnalogClock implements ClockInterface {
    constructor(h: number, m: number) {}
    tick() {
      console.log('tick tick')
    }
  }
  let digital = createClock(DiaitalClock, 12, 17)
  let analog = createClock(AnalogClock, 7, 32)

  // 泛型
  function identity<T>(arg: T): T {
    return arg
  }
  console.log('泛型', identity('233'))
})
