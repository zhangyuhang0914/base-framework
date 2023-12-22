import { createStore } from 'vuex'
import getters from './getters'
import mutations from './mutations'
import actions from './actions'

export default createStore({
  state: {
    cachedRoute: [], // 缓存路由
    currentRoute: {} // 当前路由
  },
  getters: getters,
  mutations: mutations,
  actions: actions
})
