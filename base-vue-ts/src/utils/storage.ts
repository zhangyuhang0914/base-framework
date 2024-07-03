/*
 * @Desc         : storage proxy
 * @Autor        : ZhangYuHang
 * @Date         : 2024-06-14 10:20:10
 * @LastEditors  : ZhangYuHang
 * @LastEditTime : 2024-06-14 10:20:41
 */

interface ProxyStorage {
  getItem(key: string): any
  setItem(Key: string, value: string): void
  removeItem(key: string): void
  clear(): void
}

//sessionStorage operate
class sessionStorageProxy implements ProxyStorage {
  protected storage: ProxyStorage

  constructor(storageModel: ProxyStorage) {
    this.storage = storageModel
  }

  // 存
  public setItem(key: string, value: any): void {
    this.storage.setItem(key, JSON.stringify(value))
  }

  // 取
  public getItem(key: string): any {
    return JSON.parse(this.storage.getItem(key))
  }

  // 删
  public removeItem(key: string): void {
    this.storage.removeItem(key)
  }

  // 清空
  public clear(): void {
    this.storage.clear()
  }
}

//localStorage operate
class localStorageProxy extends sessionStorageProxy implements ProxyStorage {
  constructor(localStorage: ProxyStorage) {
    super(localStorage)
  }
}

export const storageSession = new sessionStorageProxy(sessionStorage)

export const storageLocal = new localStorageProxy(localStorage)
