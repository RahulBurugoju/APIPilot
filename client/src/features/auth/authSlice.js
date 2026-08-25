import { createSlice } from "@reduxjs/toolkit";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshTokens,
  getCurrentUserThunk,
} from "./auth.thunk.js";

const initialState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  initialized: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload?.data.user;
        state.accessToken = action.payload?.data.accessToken;
        state.error = null;
        state.isAuthenticated = true;
        state.initialized = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.initialized = true;
      })
      .addCase(loginUser.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload?.data?.user;
        state.accessToken = action?.payload?.data?.accessToken;
        state.isAuthenticated = true;
        state.error = null;
        state.initialized = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.initialized = true;
      })
      .addCase(logoutUser.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.accessToken = null;
        state.error = null;
        state.initialized = true;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.initialized = true;
      })
      .addCase(getCurrentUserThunk.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCurrentUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.user = action.payload?.data;
        state.isAuthenticated = true;
        state.initialized = true;
      })
      .addCase(getCurrentUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.user = null;
        state.initialized = true;
      })
      .addCase(refreshTokens.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refreshTokens.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.accessToken = action.payload?.data?.accessToken;
        state.isAuthenticated = true;
        state.initialized = true;
      })
      .addCase(refreshTokens.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.user = null;
        state.accessToken = null;
        state.initialized = true;
      });
  },
});

export const {} = authSlice.actions;

export default authSlice.reducer;
