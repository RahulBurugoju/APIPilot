import { createSlice } from "@reduxjs/toolkit";
import requestThunk from "./request.Thunk";

const initialState = {
    requests: [],
    currentRequest: null,
    loading: false,
    error: null,
};

const requestSlice = createSlice({
    name: "request",
    initialState,
    reducers: {
        clearRequestError: (state) => {
            state.error = null;
        },
        setCurrentRequest: (state, action) => {
            state.currentRequest = action.payload;
        },
        clearCurrentRequest: (state) => {
            state.currentRequest = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Create Request
            .addCase(requestThunk.createRequest.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(requestThunk.createRequest.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                const newReq = action.payload?.data?.request;
                if (newReq) {
                    state.currentRequest = newReq;
                    if (!Array.isArray(state.requests)) {
                        state.requests = [];
                    }
                    state.requests.push(newReq);
                }
            })
            .addCase(requestThunk.createRequest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Get Collection Requests
            .addCase(requestThunk.getCollectionRequests.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(requestThunk.getCollectionRequests.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.requests = action.payload?.data?.requests || [];
            })
            .addCase(requestThunk.getCollectionRequests.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                if (!Array.isArray(state.requests)) {
                    state.requests = [];
                }
            })

            // Get Request by ID
            .addCase(requestThunk.getRequest.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(requestThunk.getRequest.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.currentRequest = action.payload?.data?.request || null;
            })
            .addCase(requestThunk.getRequest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Update Request
            .addCase(requestThunk.updateRequest.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(requestThunk.updateRequest.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                const updated =
                    action.payload?.data?.updatedRequest || action.payload?.data?.request;
                if (updated) {
                    const targetId = String(updated._id);
                    state.currentRequest = updated;
                    if (Array.isArray(state.requests)) {
                        const index = state.requests.findIndex(
                            (req) => String(req._id) === targetId
                        );
                        if (index !== -1) {
                            state.requests[index] = updated;
                        }
                    }
                }
            })
            .addCase(requestThunk.updateRequest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Delete Request
            .addCase(requestThunk.deleteRequest.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(requestThunk.deleteRequest.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                const deletedId =
                    action.payload?.data?.deletedReqId ||
                    action.payload?.data?.deletedRequest?._id;
                if (deletedId) {
                    const targetId = String(deletedId);
                    if (Array.isArray(state.requests)) {
                        state.requests = state.requests.filter(
                            (req) => String(req._id) !== targetId
                        );
                    }
                    if (state.currentRequest && String(state.currentRequest._id) === targetId) {
                        state.currentRequest = null;
                    }
                }
            })
            .addCase(requestThunk.deleteRequest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearRequestError, setCurrentRequest, clearCurrentRequest } =
    requestSlice.actions;

export default requestSlice.reducer;