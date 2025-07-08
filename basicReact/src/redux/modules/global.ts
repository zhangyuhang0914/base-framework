import type { LanguageKey } from '@/language/interface'
import type { GlobalState } from '@/redux/interface'
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

const initialState: GlobalState = {
  language: 'zh'
}

const globalSlice = createSlice({
  name: 'Global',
  initialState,
  reducers: {
    setLanguage(state: GlobalState, action: PayloadAction<LanguageKey>) {
      state.language = action.payload
    }
  }
})

export const { setLanguage } = globalSlice.actions
const globalReducer = globalSlice.reducer
export default globalReducer
