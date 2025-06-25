import { configureStore } from '@reduxjs/toolkit'
import userReducer from './reducers/userSlice'

// Reducers
const store = configureStore({
  // 一个对象，用于注册多个 slice 的 reducer
  reducer: {
    user: userReducer
  },
  // 自定义中间件（添加额外的中间件，可以在这里配置）
  // middleware: {}
  // 默认启用 Redux DevTools
  devTools: true
})

export default store
