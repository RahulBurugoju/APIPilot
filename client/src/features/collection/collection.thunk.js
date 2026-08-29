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

const updateCollection  =  createAsyncThunk('collection/updateCollection',async({projectId,collectionId,collectionDetails},thunkAPI)=>{
  try {
    const response = await collectionService.updateCollection({
      projectId,
      collectionId,
      collectionDetails,
    })
    return response;
  } catch (error) {
    const msg = error?.response?.data?.message || error?.message;
    return thunkAPI.rejectWithValue(msg || "Failed to update collection");
  }

})

const deleteCollection = createAsyncThunk('collection/deleteCollection',async({projectId,collectionId},thunkAPI)=>{
try {
  const response = await collectionService.deleteCollection({projectId,collectionId});
  return response;
} catch (error) {
  const msg = error?.response?.data?.message || error?.message;
  return thunkAPI.rejectWithValue(msg || "Failed to delete collection");
}
})

export default {
  createCollection,
  getProjectCollections,
  updateCollection,
  deleteCollection
};
