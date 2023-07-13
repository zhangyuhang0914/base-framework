import { ipcRenderer } from 'electron'

class ElectronProxy {
  constructor(ipcRenderer) {
    this.ipcRenderer = ipcRenderer
  }

  // 退出应用程序
  quit () {
    this.ipcRenderer.send('quit-app', true)
  }

  // 存
  setItem (key, value) {
    this.ipcRenderer.send('set-store-data', key, value)
  }

  // 获取数据
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

  // 删
  deleteItem (key) {
    this.ipcRenderer.send('delete-store-data', key)
  }
}

export const Store = new ElectronProxy(ipcRenderer)
