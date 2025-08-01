import type { LanguageKey } from '@/language/interface'
import type { GlobalState } from '@/redux/interface/global'
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { preferencesManager } from '@/config/preferencesManager'

const initialState: GlobalState = {
  language: preferencesManager.getLanguage() as LanguageKey,
  algorithmTheme: preferencesManager.getAlgorithmTheme()
}

const globalSlice = createSlice({
  name: 'Global',
  initialState,
  reducers: {
    setLanguage(state: GlobalState, action: PayloadAction<LanguageKey>) {
      state.language = action.payload
      // 同步更新到配置管理器
      preferencesManager.setLanguage(action.payload)
    },
    setAlgorithmTheme(state: GlobalState, action: PayloadAction<'light' | 'dark' | 'compact'>) {
      state.algorithmTheme = action.payload
      // 同步更新到配置管理器
      preferencesManager.setAlgorithmTheme(action.payload)
    },
    // 从配置管理器同步状态到 Redux
    syncFromPreferences(state: GlobalState) {
      state.language = preferencesManager.getLanguage() as LanguageKey
      state.algorithmTheme = preferencesManager.getAlgorithmTheme()
    }
  }
})

export const { setLanguage, setAlgorithmTheme, syncFromPreferences } = globalSlice.actions
const globalReducer = globalSlice.reducer
export default globalReducer
