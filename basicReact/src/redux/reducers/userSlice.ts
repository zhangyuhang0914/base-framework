import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// 异步操作
export const fetchUser = createAsyncThunk('user/fetchUser', async userId => {
  const response = await fetch(`/api/users/${userId}`)
  return response.json()
})

// 定义 slice
const userSlice = createSlice({
  name: 'user',
  initialState: { user: null, status: 'idle', error: {} },
  reducers: {
    clearUser(state) {
      state.user = null
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchUser.pending, state => {
        state.status = 'loading'
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.user = action.payload
      })
      .addCase(fetchUser.rejected, state => {
        state.status = 'failed'
      })
  }
})

// 导出同步 action
export const { clearUser } = userSlice.actions

// 导出 reducer
export default userSlice.reducer
