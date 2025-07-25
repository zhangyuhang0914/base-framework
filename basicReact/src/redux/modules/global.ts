import type { LanguageKey } from '@/language/interface'
import type { GlobalState, ThemeSettings, SettingConf, LayoutSettings } from '@/redux/interface'
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { antdTheme } from '@/constants/theme'
import { UnitConverter } from '@/utils/common/unitConverter'

const initialState: GlobalState = {
  language: 'zh',
  settingConf: {
    theme: {
      primaryColor: UnitConverter.getCssVariable('--color-primary'),
      config: antdTheme
    },
    layout: {
      siderCollapsed: false,
      showHeader: true,
      showFooter: true
    }
  }
}

const globalSlice = createSlice({
  name: 'Global',
  initialState,
  reducers: {
    setLanguage(state: GlobalState, action: PayloadAction<LanguageKey>) {
      state.language = action.payload
    },
    setSettingConf(state: GlobalState, action: PayloadAction<SettingConf>) {
      state.settingConf = action.payload
    },
    setTheme(state: GlobalState, action: PayloadAction<ThemeSettings>) {
      state.settingConf.theme = action.payload
    },
    setLayout(state: GlobalState, action: PayloadAction<LayoutSettings>) {
      state.settingConf.layout = {
        ...state.settingConf.layout,
        ...action.payload
      }
    },
    setPrimaryColor(state: GlobalState, action: PayloadAction<string>) {
      state.settingConf.theme.primaryColor = action.payload
      if (state.settingConf.theme.config) {
        state.settingConf.theme.config.token = {
          ...state.settingConf.theme.config.token,
          colorPrimary: action.payload
        }
      }
    }
  }
})

export const { setLanguage, setSettingConf, setTheme, setLayout, setPrimaryColor } = globalSlice.actions
const globalReducer = globalSlice.reducer
export default globalReducer
