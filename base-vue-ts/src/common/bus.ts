// 测试 eventBus
export const TEST_EVENT_BUS = 'TEST_EVENT_BUS'
class Bus {
  list: { [key: string]: Array<() => void> }
  private static instance: Bus = new Bus()
  constructor() {
    // 收集订阅信息,调度中心
    this.list = {}
  }
  public static getInstance(): Bus {
    return Bus.instance
  }
  // 订阅
  public $on(name: string, fn?: () => void) {
    this.list[name] = this.list[name] || []
    fn && this.list[name].push(fn)
  }
  // 发布
  public $emit(name: string, data: any) {
    if (this.list[name]) {
      this.list[name].forEach((fn: <T>(T: any) => void | T) => {
        fn(data)
      })
    }
  }
  // 取消订阅
  public $off(name: string) {
    if (this.list[name]) {
      delete this.list[name]
    }
  }
}

export default Bus.getInstance()
