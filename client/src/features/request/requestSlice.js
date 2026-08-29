import { createSlice } from "@reduxjs/toolkit"
import requestThunk from "./request.thunk.js"

const initialState = {
    requests: [],
    currentRequest: null,
    loading: false,
    error: null,
}

const requestSlice = createSlice({
    name: 'request',
    initialState,
    reducers: {
        clearRequestError:(state)=>{
            state.error = null;
        },

    },
    extraReducers: (builder) => {
        builder
        .addCase(requestThunk.createRequest.pending,(state)=>{
            state.loading = true;
            state.error =null;
        })
        .addCase(requestThunk.createRequest.fulfilled,(state,actions)=>{
            state.loading = false;
            state.error = null;
            state.currentRequest = actions.payload?.data?.request;
            
            if(actions.payload?.data?.request){
                state.requests.push(actions.payload?.data?.request);
            }
        })
        .addCase(requestThunk.createRequest.rejected,(state,actions)=>{
            state.loading = false;
            state.error = actions.payload;  
        })

        .addCase(requestThunk.getCollectionRequests.pending,(state)=>{
            state.loading = true;
            state.error =null;
        })
        .addCase(requestThunk.getCollectionRequests.fulfilled,(state,actions)=>{
            state.loading = false;
            state.error = null;
            state.requests = actions.payload?.data?.requests || [];
        })
        .addCase(requestThunk.getCollectionRequests.rejected,(state,actions)=>{
            state.loading = false;
            state.error = actions.payload;
            state.requests = state.requests || [];
        })

        .addCase(requestThunk.getRequest.pending,(state)=>{
            state.loading = true;
            state.error =null;
        })
        .addCase(requestThunk.getRequest.fulfilled,(state,actions)=>{
            state.loading = false;
            state.error = null;
            state.currentRequest = actions.payload?.data?.request;
        })
        .addCase(requestThunk.getRequest.rejected,(state,actions)=>{
            state.loading = false;
            state.error = actions.payload;
            state.currentRequest = state.currentRequest || null;
        })

        .addCase(requestThunk.updateRequest.pending,(state)=>{
            state.loading = true;
            state.error =null;
        })
        .addCase(requestThunk.updateRequest.fulfilled,(state,actions)=>{
            state.loading = false;
            state.error = null;
            state.currentRequest = actions.payload?.data?.updatedRequest;
            if(actions.payload?.data?.updatedRequest){
                const index = state.requests.findIndex((request)=>request._id === actions.payload?.data?.updatedRequest._id);
                if(index !== -1){
                    state.requests[index] = actions.payload?.data?.updatedRequest;
                }
            }
        })
        .addCase(requestThunk.updateRequest.rejected,(state,actions)=>{
            state.loading = false;
            state.error = actions.payload;
        })

        .addCase(requestThunk.deleteRequest.pending,(state)=>{
            state.loading = true;
            state.error = null;  
        })
        .addCase(requestThunk.deleteRequest.fulfilled,(state,actions)=>{
            state.loading = false;
            state.error = null;
            const deletedId = actions.payload?.data?.deletedReqId;  
            if(deletedId){
                state.requests = state.requests.filter((request)=>request._id !== deletedId);
            }
            if(state.currentRequest?._id === deletedId){
                state.currentRequest = null;
            }            
        })      
        .addCase(requestThunk.deleteRequest.rejected,(state,actions)=>{
            state.loading = false;
            state.error = actions.payload;  
        })  
    }

})

export const { clearRequestError} = requestSlice.actions

export default requestSlice.reducer