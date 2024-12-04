// 测试 eventBus
export const TEST_EVENT_BUS = 'TEST_EVENT_BUS'

class Bus {
  list: { [key: string]: Array<Function> }
  private static instance: Bus = new Bus()
  constructor() {
    // 收集订阅信息,调度中心
    this.list = {}
  }
  public static getInstance(): Bus {
    return Bus.instance
  }

  // 订阅
  public $on(name: string, fn: Function) {
    this.list[name] = this.list[name] || []
    this.list[name].push(fn)
  }

  // 发布
  public $emit(name: string, data?: any) {
    if (this.list[name]) {
      this.list[name].forEach((fn: Function) => {
        fn(data)
      })
    }
  }

  // 取消订阅
  public $off(name: string, fn?: Function) {
    if (this.list[name]) {
      delete this.list[name]
    }
  }
}

export default Bus.getInstance()
