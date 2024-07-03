import { defineStore } from 'pinia'
import { store } from '../index'
import CameraStream from '@/commons/camera-stream'

export const userCommonStore = defineStore({
  id: 'common',
  state: () => {
    return {
      baseUrl: '', // 缓存服务器地址
      cameraInstance: null, // 摄像头
      userInfo: '',
      reloadPage: false // 缓存页面重新加载页面
    }
  },
  actions: {
    setBaseUrl (baseUrl) {
      this.baseUrl = baseUrl
    },
    setUserInfo (info) {
      this.userInfo = info
    },
    setReloadPage (flg) {
      this.reloadPage = flg
    }
  },
  getters: {
    getCameraInstance: state => data => {
      return state.cameraInstance = new CameraStream({
        width: data.width,
        height: data.height,
        types: data.types,
        containerId: data.containerId,
        jsqrCallback: data.jsqrCallback,
        photoCallback: data.photoCallback
      })
    }
  },
  persist: {
    // 开启持久化存储
    enabled: true,
    // 自定义持久化参数
    strategies: [
      {
        // 自定义key,默认就是仓库的key
        key: 'h5',
        // 自定义存储方式，默认sessionStorage
        storage: localStorage,
        // 指定要持久化的数据，默认所有 state 都会进行缓存，可以通过 paths 指定要持久化的字段，其他的则不会进行持久化。
        paths: ['token']
      }
    ]
  }
})

export function userCommonStoreHook () {
  return userCommonStore(store)
}
