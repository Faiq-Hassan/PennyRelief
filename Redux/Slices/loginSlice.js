// userSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_ENDPOINTS } from '@/constants/Project.Api';
import { ToastAndroid } from 'react-native';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';

// Async Thunk for login
export const loginUser = createAsyncThunk(
    'login/loginUser',
    async ({UserData,navigation}, { rejectWithValue }) => {
      console.log("Attempting to login with: ", UserData); // Add logging here
      try {
        const response = await axios.post(API_ENDPOINTS.login, UserData);
        console.log("Response Data: ", response.data);
        if (response.status === 200) {
          const { Token , user } = response.data;

          await AsyncStorage.setItem('authToken', Token);
             Toast.show({
          type: 'success',
          text1: 'Login Successful',
          text2: 'Welcome back! 🎉',
        });
          router.replace('(tabs)');
          return {user , Token};
        } else {
          return rejectWithValue('Login failed');
        }
      } catch (error) {
        console.log("Login Error: ", error.response || error);
       Toast.show({
          type: 'error',
          text1: 'Login Failed',
          text2: error.response?.data?.message || 'An error occurred during login.',
       })
        return rejectWithValue(error.response?.data?.message || 'Login failed');
      }
    }
  );

const userSlice = createSlice({
  name: 'login',
  initialState: {
    user : '',
    token: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;    // .user
        state.token = action.payload.Token;  // .Token
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default userSlice.reducer;
