import { createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../../services/auth.service.js";

const registerUser = createAsyncThunk("auth/register",async(userDetails,thunkAPI)=>{
    try {
        return await authService.register(userDetails)
    } catch (error) {
        const msg = error.response?.data?.message || error?.message

        return thunkAPI.rejectWithValue(msg || "Registration failed")
    }
})

const loginUser = createAsyncThunk("auth/login",async(userDetails,thunkAPI)=>{
    try {
        return await authService.login(userDetails)
    } catch (error) {
        const msg = error?.response?.data?.message || error?.message

        return thunkAPI.rejectWithValue(msg || "Login failed")
    }
})
const logoutUser = createAsyncThunk('auth/logout',async(_,thunkAPI)=>{
    try{
        return await authService.logout()
    }catch(error){
        const msg = error?.response?.data?.message || error?.message;
        return thunkAPI.rejectWithValue(msg || "Logout failed")
    }
})
const refreshTokens = createAsyncThunk('auth/refresh-token',async(_,thunkAPI)=>{
    try{
        return await authService.refreshAccessToken()
    }catch(error){
        const msg = error?.response?.data?.message || error?.message;
        return thunkAPI.rejectWithValue(msg || "Token refresh failed")
    }
})
const getCurrentUserThunk = createAsyncThunk('auth/me',async(_,thunkAPI)=>{
    try{
        return await authService.getCurrentUser()
    }catch(error){
        const msg = error?.response?.data?.message || error?.message;
        return thunkAPI.rejectWithValue(msg || "Failed to fetch current user")
    }
})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshTokens,
    getCurrentUserThunk
}