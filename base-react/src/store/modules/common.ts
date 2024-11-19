import { createSlice } from '@reduxjs/toolkit'
import { storageLocal } from '@/utils/storage.ts'

const commonStore = createSlice({
  name: 'common',
  // 数据状态
  initialState: {
    token: storageLocal.getItem('token')
  },
  // 同步修改方法
  reducers: {
    setToken(state, action) {
      state.token = action.payload
    }
  }
})

// 解构出actionCreater
const { setToken } = commonStore.actions

// 获取reducer函数
const commonReducer = commonStore.reducer
// 异步方法封装
const fetchLoginFn = (loginForm: any) => {
  return async (dispatch: any, getState: any) => {
    // const res = await fetchLogin(loginForm)
    // if (res.code === 200) {
    //   // 存储token
    //   storageLocal.setItem('token', res.data.token)
    //   // 派发action
    //   dispatch(setToken(res.data.token))
    // }
  }
}

export { fetchLoginFn }

export default commonReducer
