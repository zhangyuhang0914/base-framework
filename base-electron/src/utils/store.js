import { getCurrentInstance } from 'vue'
const global = getCurrentInstance().appContext.config.globalProperties
class electronStore {
  constructor(store) {
    this.store = store
  }

  // 存
  setItem (key, value) {
    this.store.set(key, JSON.stringify(value))
  }

  // 取
  getItem (key) {
    return JSON.parse(this.store.get(key))
  }
}

export const storageSession = new electronStore(global.$electronStore)
