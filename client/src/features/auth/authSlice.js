import {createSlice} from "@reduxjs/toolkit"


const initialState={
    user:null,
    accessToken:null,
    isAuthenticated:false,
    loading:false,
    error:null,
    initialized:false
};

const authSlice = createSlice({
    name:"auth",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder
            .addCase()
    }
})

export const {} = authSlice.actions;

export default authSlice.reducer