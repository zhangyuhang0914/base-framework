// 测试 eventBus
export const TEST_EVENT_BUS = 'TEST_EVENT_BUS'
// 刷新
export const REFRESH = 'REFRESH'
// 政策新闻类型
export const POLICYTYPE = 'POLICYTYPE'
// 刷新收藏状态
export const REFRESH_COLLECTION = 'REFRESH_COLLECTION'
// 全局检索
export const GLOBAL_SEARCH = 'GLOBAL_SEARCH'
// 融资记录状态刷新
export const FINANCE_RECORD_STATUS_REFRESH = 'FINANCE_RECORD_STATUS_REFRESH'
// 供应链金融需求状态刷新
export const SUPPLY_CHAIN_FINANCE_RECORD_STATUS_REFRESH = 'SUPPLY_CHAIN_FINANCE_RECORD_STATUS_REFRESH'
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
  public $emit(name: string, data: any) {
    if (this.list[name]) {
      this.list[name].forEach(fn => {
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
