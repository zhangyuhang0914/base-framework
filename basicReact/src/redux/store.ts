import { configureStore } from '@reduxjs/toolkit'

// Reducers
const store = configureStore({
  devTools: true
})

export default store
