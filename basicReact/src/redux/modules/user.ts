import type { UserState } from '@/redux/interface/global'
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

const initialState: UserState = {
  token: ''
}

const userSlice = createSlice({
  name: 'User',
  initialState,
  reducers: {
    setToken(state: UserState, action: PayloadAction<string>) {
      state.token = action.payload
    },
    logout(state: UserState) {
      state.token = ''
    }
  }
})

export const { setToken, logout } = userSlice.actions
const userReducer = userSlice.reducer
export default userReducer
