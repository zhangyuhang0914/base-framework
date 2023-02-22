/**
 * @Desc         : storage存储
 * @Autor        : ZYH
 * @Date         : 2023-02-13 10:56:32
 * @LastEditors  : ZYH
 * @LastEditTime : 2023-02-13 11:05:14
*/
class sessionStorageProxy {
  constructor(storageModel) {
    this.storage = storageModel
  }
  // 存
  setItem (key, value) {
    this.storage.setItem(key, JSON.stringify(value))
  }

  // 取
  getItem (key) {
    return JSON.parse(this.storage.getItem(key))
  }

  // 删
  removeItem (key) {
    this.storage.removeItem(key)
  }

  // 清空
  clear () {
    this.storage.clear()
  }
}

class localStorageProxy extends sessionStorageProxy {
  constructor(localStorage) {
    super(localStorage)
  }
}

export const storageSession = new sessionStorageProxy(sessionStorage)
export const storageLocal = new localStorageProxy(localStorage)
