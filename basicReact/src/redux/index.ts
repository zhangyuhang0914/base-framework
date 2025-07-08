import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer, type PersistConfig } from 'redux-persist'
import storageSession from 'redux-persist/lib/storage/session'

import userReducer from '@/redux/modules/user'
import globalReducer from '@/redux/modules/global'

// 临时 RootState 类型定义（供 persistConfig 用）
export type RootState = ReturnType<typeof rootReducer>

// Redux Persist 配置
const persistConfig: PersistConfig<RootState> = {
  key: 'root',
  storage: storageSession,
  whitelist: ['global', 'user']
}

// 合并reducer
const rootReducer = combineReducers({
  global: globalReducer,
  user: userReducer
})

// 持久化redux
const persistedReducer = persistReducer(persistConfig, rootReducer)

// Reducers
export const store = configureStore({
  // 一个对象，用于注册多个 slice 的 reducer
  reducer: persistedReducer,
  // 自定义中间件（添加额外的中间件，可以在这里配置）
  // 关闭 redux 序列化检测
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({ serializableCheck: false }),
  // 默认启用 Redux DevTools
  devTools: process.env.NODE_ENV !== 'production'
})

// 持久化对象
export const persistor = persistStore(store)

// 类型到处
export type AppDispatch = typeof store
