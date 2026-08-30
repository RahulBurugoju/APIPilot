import { createAsyncThunk } from "@reduxjs/toolkit";
import requestHistoryService from "../../services/request-history.service.js";

export const fetchRequestHistory = createAsyncThunk(
  "requestHistory/fetchRequestHistory",
  async ({ projectId, requestId, page = 1, limit = 20 }, thunkAPI) => {
    try {
      const response = await requestHistoryService.getRequestHistory({
        projectId,
        requestId,
        page,
        limit,
      });
      return response;
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to fetch request history";
      return thunkAPI.rejectWithValue(msg);
    }
  }
);

export const fetchExecution = createAsyncThunk(
  "requestHistory/fetchExecution",
  async ({ projectId, requestId, executionId }, thunkAPI) => {
    try {
      const response = await requestHistoryService.getExecutionById({
        projectId,
        requestId,
        executionId,
      });
      return response;
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to fetch execution details";
      return thunkAPI.rejectWithValue(msg);
    }
  }
);

export const deleteExecution = createAsyncThunk(
  "requestHistory/deleteExecution",
  async ({ projectId, requestId, executionId }, thunkAPI) => {
    try {
      const response = await requestHistoryService.deleteExecution({
        projectId,
        requestId,
        executionId,
      });
      return { response, executionId };
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to delete execution history record";
      return thunkAPI.rejectWithValue(msg);
    }
  }
);

export const clearHistory = createAsyncThunk(
  "requestHistory/clearHistory",
  async ({ projectId, requestId }, thunkAPI) => {
    try {
      const response = await requestHistoryService.clearRequestHistory({
        projectId,
        requestId,
      });
      return response;
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to clear request history";
      return thunkAPI.rejectWithValue(msg);
    }
  }
);

export default {
  fetchRequestHistory,
  fetchExecution,
  deleteExecution,
  clearHistory,
};
