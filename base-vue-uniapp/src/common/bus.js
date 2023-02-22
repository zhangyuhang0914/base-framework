/**
 * @Desc         : 事件总线
 * @Autor        : ZYH
 * @Date         : 2023-02-17 15:55:06
 * @LastEditors  : ZYH
 * @LastEditTime : 2023-02-17 16:00:18
*/

class Bus {
  instance = new Bus()
  constructor() {
    // 收集订阅信息,调度中心
    this.list = {}
  }
  getInstance () {
    return Bus.instance
  }
  // 订阅
  $on (name, fn) {
    this.list[name] = this.list[name] || []
    this.list[name].push(fn)
  }
  // 发布
  $emit (name, data) {
    if (this.list[name]) {
      this.list[name].forEach(fn => {
        fn(data)
      })
    }
  }
  // 取消订阅
  $off (name, fn) {
    if (this.list[name]) {
      delete this.list[name]
    }
  }
}

export default Bus.getInstance()
