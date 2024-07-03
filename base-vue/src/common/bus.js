/**
 * @Desc         : 事件总线
 * @Autor        : ZYH
 * @Date         : 2023-02-17 17:18:00
 * @LastEditors  : ZYH
 * @LastEditTime : 2023-02-17 17:26:41
 */

class Bus {
  instance = new Bus()
  constructor() {
    // 收集订阅信息,调度中心
    this.list = {}
  }
  getInstance() {
    return Bus.instance
  }

  // 订阅
  $on(name, fn) {
    this.list[name] = this.list[name] || []
    this.list[name].push(fn)
  }

  // 发布
  $emit(name, data) {
    if (this.list[name]) {
      this.list[name].forEach(fn => {
        fn(data)
      })
    }
  }

  // 取消订阅
  $off(name) {
    if (this.list[name]) {
      delete this.list[name]
    }
  }
}

export default Bus.getInstance()
