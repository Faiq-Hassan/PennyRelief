import { configureStore } from '@reduxjs/toolkit'
import UserReducers from '../Redux/slices/userSlice'

export const store = configureStore({
  reducer: {
    user : UserReducers
  },
})