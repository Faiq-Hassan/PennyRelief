import { configureStore } from '@reduxjs/toolkit'
import loginReducer from './Slices/loginSlice'


export const store = configureStore({
  reducer: {
    login: loginReducer,
  },
})