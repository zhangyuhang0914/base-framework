import { ipcRenderer } from 'electron'

class ElectronProxy {
  constructor(ipcRenderer) {
    this.ipcRenderer = ipcRenderer
  }

  // 退出应用程序
  quit () {
    this.ipcRenderer.send('quit-app', true)
  }

  // 取主进程数据
  getMainData (key) {
    return new Promise((resolve, reject) => {
      this.ipcRenderer.on(key, (event, data) => {
        resolve(event, data)
      })
    })
  }

  // 存 store 数据
  setItem (key, value) {
    this.ipcRenderer.send('set-store-data', key, value)
  }

  // 取 store 数据
  getItem (key) {
    return new Promise((resolve, reject) => {
      const dataObject = {}
      this.ipcRenderer.send('get-store-data', key)
      this.ipcRenderer.on('get-data-reply', (event, { key, data }) => {
        dataObject[key] = data
        // console.log('获取数据', key, dataObject)
        resolve(dataObject[key] ? dataObject[key] : '')
      })
    })
  }

  // 删 store 数据
  deleteItem (key) {
    this.ipcRenderer.send('delete-store-data', key)
  }
}

export const Store = new ElectronProxy(ipcRenderer)
