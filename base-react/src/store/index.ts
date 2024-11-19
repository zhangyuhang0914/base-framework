import { configureStore } from '@reduxjs/toolkit'
import commonReducer from './modules/common'

export default configureStore({
  reducer: {
    common: commonReducer
  }
})
