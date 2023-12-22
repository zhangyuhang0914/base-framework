import * as types from './type'

export default {
  // 获取缓存路由
  [types.M_CACHED_ROUTE](state: any, data: any) {
    console.log('M_CACHED_ROUTE', data)
    state.cachedRoute = data
    if (data.type === 'del') {
      state.cachedRoute = state.cachedRoute.filter((item: any) => item !== data.path)
      return false
    }
    if (!state.cachedRoute.some((item: any) => item === data.path)) {
      state.cachedRoute.push(data.path)
    }
  }
}
