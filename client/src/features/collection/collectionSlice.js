import { createSlice } from "@reduxjs/toolkit";
import collectionThunk from "./collection.thunk.js";
const initialState = {
  collection: null,
  collections: [],
  loading: false,
  error: null,
};
const collectionSlice = createSlice({
  name: "collection",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(collectionThunk.createCollection.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(collectionThunk.createCollection.fulfilled, (state, action) => {
        state.loading = false;

        state.collections.push(action.payload?.data?.collection);
        state.collection = action.payload?.data?.collection;
      })

      .addCase(collectionThunk.createCollection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.collection = null;
        state.collections = []
      })

      .addCase(collectionThunk.getProjectCollections.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(collectionThunk.getProjectCollections.fulfilled, (state, action) => {
        state.loading = false;
        state.collections = action.payload?.data?.collections;
      })

      .addCase(collectionThunk.getProjectCollections.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.collections = [];
      })

  },
});

export const {} = collectionSlice.actions;
export default collectionSlice.reducer;
