import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../features/auth/authSlice.js'
import projectReducer from "../features/project/projectSlice.js"
import collectionReducer from '../features/collection/collectionSlice.js'
export const store = configureStore({
    reducer:{
        auth:authReducer,
        project:projectReducer,
        collection:collectionReducer
    }
})