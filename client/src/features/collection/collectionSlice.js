import { createSlice } from "@reduxjs/toolkit";

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
    
  }
});

export const {} = collectionSlice.actions;
export default collectionSlice.reducer;