import { defineStore } from 'pinia'

export const userCommonStore = defineStore({
  id: 'common',
  state: () => {
    return {
      name: '张宇航'
    }
  },
  actions: {
    updateName(name) {
      this.name = name
    }
  }
})
