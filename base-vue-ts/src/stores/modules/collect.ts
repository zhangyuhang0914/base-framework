import { defineStore } from "pinia"
import { store } from "../index"

interface CollectType {
  collect: Map<string, any>
}
// getUserInfoById('cp')
export const userCollectStore = defineStore({
  id: "Collect",
  state: (): CollectType => ({
    collect: new Map()
  }),
  getters: {
    getCollect(state) {
      return (userAccount: string) => {
        return state.collect.get(userAccount)
      }
    },
    isCollect(state) {
      return (userAccount: string) => {
        return state.collect.has(userAccount)
      }
    }
  },
  actions: {
    initCollect(data: Array<AnyObject>, key: string = 'user_name') {
      data.map((item:any) => {
        this.collect.set(item[key], item)
      })
    },
    setCollect(key: string, value?: any){
      this.collect.set(key, value || '')
    },
    deleteCollect(key: string) {
      this.collect.delete(key)
    }
  }
})

export function userCollectStoreHook() {
  return userCollectStore(store);
}
