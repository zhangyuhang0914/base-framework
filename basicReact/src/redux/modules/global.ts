import type { GlobalState } from '@/redux/interface'
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

const initialState: GlobalState = {
  language: 'zh-CN',
  lastTime: 0
}

const globalSlice = createSlice({
  name: 'Global',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload
    },
    setLastTime: (state, action: PayloadAction<number>) => {
      state.lastTime = action.payload
    }
  }
})

export const { setLanguage, setLastTime } = globalSlice.actions
const globalReducer = globalSlice.reducer
export default globalReducer
