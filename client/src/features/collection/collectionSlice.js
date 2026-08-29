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
      .addCase(collectionThunk.updateCollection.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(collectionThunk.updateCollection.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        const updated = action.payload?.data?.updatedCollection;
        if (updated) {
          const updatedId = String(updated._id);
          const index = state.collections.findIndex(
            (c) => String(c._id) === updatedId
          );
          if (index !== -1) {
            state.collections[index] = updated;
          }
          if (state.collection && String(state.collection._id) === updatedId) {
            state.collection = updated;
          }
        }
      })
      .addCase(collectionThunk.updateCollection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(collectionThunk.deleteCollection.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(collectionThunk.deleteCollection.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        const deletedId = action.payload?.data?.deletedCollectionId;
        if (deletedId) {
          const targetId = String(deletedId);
          state.collections = state.collections.filter(
            (c) => String(c._id) !== targetId
          );

          if (state.collection && String(state.collection._id) === targetId) {
            state.collection = null;
          }
        }
      })
      .addCase(collectionThunk.deleteCollection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      
  },
});

export const {} = collectionSlice.actions;
export default collectionSlice.reducer;
