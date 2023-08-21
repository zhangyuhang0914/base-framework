import { defineStore } from 'pinia'
import { store } from '../index'

interface commonType {
  test: string | number
  testData: AnyObject
}

export const userCommonStore = defineStore({
  id: 'common',
  state: (): commonType => ({
    test: '123',
    testData: {}
  })
})

export function userCommonStoreHook() {
  return userCommonStore(store)
}
