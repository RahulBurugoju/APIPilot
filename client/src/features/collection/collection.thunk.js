import { createAsyncThunk } from "@reduxjs/toolkit";
import collectionService from "../../services/collection.service.js";

const createCollection = createAsyncThunk(
  "collection/createCollection",
  async ({ collectionDetails, projectId }, thunkAPI) => {
    try {
      const response = await collectionService.createCollection({
        collectionDetails,
        projectId,
      });
      return response;
    } catch (error) {
      const msg = error?.response?.data?.message || error?.message;
      return thunkAPI.rejectWithValue(msg || "Failed to create collection");
    }
  },
);

const getProjectCollections = createAsyncThunk(
  "collection/getProjectCollections",
  async ({ projectId }, thunkAPI) => {
    try {
      const response = await collectionService.getProjectCollections({
        projectId,
      });
      return response;
    } catch (error) {
      const msg = error?.response?.data?.message || error?.message;
      return thunkAPI.rejectWithValue(msg || "Failed to fetch collections");
    }
  },
);

export default {
  createCollection,
  getProjectCollections,
};
