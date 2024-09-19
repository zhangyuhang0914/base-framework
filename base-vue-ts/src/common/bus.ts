// 测试 eventBus
export const TEST_EVENT_BUS = 'TEST_EVENT_BUS'
// 登录
export const OPEN_LOGIN = 'OPEN_LOGIN'
class Bus {
  private list: { [key: string]: Function[] } = {}
  private static instance: Bus = new Bus()
  constructor() {
    // 收集订阅信息,调度中心
    this.list = {}
  }
  public static getInstance(): Bus {
    return Bus.instance
  }
  // 订阅
  public $on<T>(name: string, fn: (data: T) => void) {
    this.list[name] = this.list[name] || []
    fn && this.list[name].push(fn)
  }

  // 发布
  public $emit<T>(name: string, data: T) {
    if (this.list[name]) {
      this.list[name].forEach(fn => fn(data))
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
