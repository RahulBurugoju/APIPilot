import { createSlice } from "@reduxjs/toolkit";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshTokens,
  getCurrentUserThunk,
  initializeAuth,
} from "./auth.thunk.js";
import { setAccessToken, clearAccessToken } from "../../lib/axios.js";

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
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
    clearAuth: () => initialState,
    resetAuthState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload?.data?.user;
        state.accessToken = action.payload?.data?.accessToken;
        state.error = null;
        state.isAuthenticated = true;
        state.initialized = true;
        setAccessToken(action.payload?.data?.accessToken);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.initialized = true;
      })
      .addCase(loginUser.pending, (state) => {
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
        setAccessToken(action.payload?.data?.accessToken);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.initialized = true;
      })
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.accessToken = null;
        state.error = null;
        state.initialized = true;
        clearAccessToken();
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.user = null;
        state.isAuthenticated = false;
        state.accessToken = null;
        state.initialized = true;
        clearAccessToken();
      })
      .addCase(getCurrentUserThunk.pending, (state) => {
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
      .addCase(refreshTokens.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refreshTokens.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.accessToken = action.payload?.data?.accessToken;
        state.isAuthenticated = true;
        state.initialized = true;
        setAccessToken(action.payload?.data?.accessToken);
      })
      .addCase(refreshTokens.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.user = null;
        state.accessToken = null;
        state.initialized = true;
        clearAccessToken();
      })
      .addCase(initializeAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.initialized = false;
      })
      .addCase(initializeAuth.fulfilled, (state) => {
        state.loading = false;
        state.initialized = true;
      })
      .addCase(initializeAuth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.initialized = true;
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
        clearAccessToken();
      });
  },
});

export const { clearAuthError, clearAuth, resetAuthState } = authSlice.actions;

export default authSlice.reducer;
