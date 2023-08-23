import { defineStore } from 'pinia'
import { store } from '../index'

interface commonType {
  test: string | number
  testData: AnyObject
  networkState: Boolean
}

export const userCommonStore = defineStore({
  id: 'common',
  state: (): commonType => ({
    test: '123',
    testData: {},
    networkState: true
  }),
  actions: {
    setNetwork(flag: boolean) {
      this.networkState = flag
    }
  }
})

export function userCommonStoreHook() {
  return userCommonStore(store)
}
