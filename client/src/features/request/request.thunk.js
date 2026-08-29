import { createAsyncThunk } from "@reduxjs/toolkit";
import requestService from "../../services/request.service.js";

const createRequest = createAsyncThunk(
  "request/createRequest",
  async ({ projectId, collectionId, requestDetails }, thunkAPI) => {
    try {
      const response = await requestService.createRequest({
        projectId,
        collectionId,
        requestDetails,
      });
      return response;
    } catch (error) {
      const msg = error?.response?.data?.message || error?.message;
      return thunkAPI.rejectWithValue(msg || "Failed to create request");
    }
  }
);

const getCollectionRequests = createAsyncThunk(
  "request/getCollectionRequests",
  async ({ projectId, collectionId }, thunkAPI) => {
    try {
      const response = await requestService.getCollectionRequests({
        projectId,
        collectionId,
      });
      return response;
    } catch (error) {
      const msg = error?.response?.data?.message || error?.message;
      return thunkAPI.rejectWithValue(msg || "Failed to fetch requests");
    }
  }
);

const getRequest = createAsyncThunk(
  "request/getRequest",
  async ({ projectId, collectionId, requestId }, thunkAPI) => {
    try {
      const response = await requestService.getRequest({
        projectId,
        collectionId,
        requestId,
      });
      return response;
    } catch (error) {
      const msg = error?.response?.data?.message || error?.message;
      return thunkAPI.rejectWithValue(msg || "Failed to fetch request");
    }
  }
);

const updateRequest = createAsyncThunk(
  "request/updateRequest",
  async ({ projectId, collectionId, requestId, requestDetails }, thunkAPI) => {
    try {
      const response = await requestService.updateRequest({
        projectId,
        collectionId,
        requestId,
        requestDetails,
      });
      return response;
    } catch (error) {
      const msg = error?.response?.data?.message || error?.message;
      return thunkAPI.rejectWithValue(msg || "Failed to update request");
    }
  }
);

const deleteRequest = createAsyncThunk(
  "request/deleteRequest",
  async ({ projectId, collectionId, requestId }, thunkAPI) => {
    try {
      const response = await requestService.deleteRequest({
        projectId,
        collectionId,
        requestId,
      });
      return response;
    } catch (error) {
      const msg = error?.response?.data?.message || error?.message;
      return thunkAPI.rejectWithValue(msg || "Failed to delete request");
    }
  }
);

export default {
  createRequest,
  getCollectionRequests,
  getRequest,
  updateRequest,
  deleteRequest,
};