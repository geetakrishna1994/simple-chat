import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isLoading: false,
  error: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      return state;
    },
    loginSuccess: (state, action) => {
      state.isLoading = false;
      state.user = { ...action.payload };
      return state;
    },
    loginFailed: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      return state;
    },
    logoutStart: (state) => {
      state.isLoading = true;
      return state;
    },
    logoutSuccess: (state, action) => {
      state.isLoading = false;
      state.user = null;
      return state;
    },
    logoutFailed: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      return state;
    },
    resetAuth: (state) => {
      return initialState;
    },
  },
});

export const {
  loginStart,
  loginFailed,
  loginSuccess,
  logoutStart,
  logoutFailed,
  logoutSuccess,
  resetAuth,
} = authSlice.actions;
export default authSlice.reducer;
