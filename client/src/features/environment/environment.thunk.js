import { createAsyncThunk } from "@reduxjs/toolkit";
import environmentService from "../../services/environment.service.js";

export const createEnvironment = createAsyncThunk(
  "environment/createEnvironment",
  async (args, thunkAPI) => {
    try {
      const { projectId, environmentDetails, ...rest } = args || {};
      const details = environmentDetails || rest;
      const response = await environmentService.createEnvironment({
        projectId,
        environmentDetails: details,
      });
      return response;
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to create environment";
      return thunkAPI.rejectWithValue(msg);
    }
  }
);

export const getProjectEnvironments = createAsyncThunk(
  "environment/getProjectEnvironments",
  async (args, thunkAPI) => {
    try {
      const projectId = typeof args === "object" ? args?.projectId : args;
      const response = await environmentService.getProjectEnvironments({
        projectId,
      });
      return response;
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to fetch environments";
      return thunkAPI.rejectWithValue(msg);
    }
  }
);

export const getEnvironmentById = createAsyncThunk(
  "environment/getEnvironmentById",
  async ({ projectId, environmentId }, thunkAPI) => {
    try {
      const response = await environmentService.getEnvironmentById({
        projectId,
        environmentId,
      });
      return response;
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to fetch environment";
      return thunkAPI.rejectWithValue(msg);
    }
  }
);

export const updateEnvironment = createAsyncThunk(
  "environment/updateEnvironment",
  async (args, thunkAPI) => {
    try {
      const { projectId, environmentId, environmentDetails, ...rest } =
        args || {};
      const details = environmentDetails || rest;
      const response = await environmentService.updateEnvironment({
        projectId,
        environmentId,
        environmentDetails: details,
      });
      return response;
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to update environment";
      return thunkAPI.rejectWithValue(msg);
    }
  }
);

export const deleteEnvironment = createAsyncThunk(
  "environment/deleteEnvironment",
  async (args, thunkAPI) => {
    try {
      const projectId = args?.projectId;
      const environmentId =
        typeof args === "object" ? args?.environmentId : args;
      const response = await environmentService.deleteEnvironment({
        projectId,
        environmentId,
      });
      return { response, environmentId };
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to delete environment";
      return thunkAPI.rejectWithValue(msg);
    }
  }
);

export const activateEnvironment = createAsyncThunk(
  "environment/activateEnvironment",
  async ({ projectId, environmentId }, thunkAPI) => {
    try {
      const fn =
        environmentService.activateEnvironment ||
        environmentService.setActiveEnvironment;
      const response = await fn({
        projectId,
        environmentId,
      });
      return response;
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to activate environment";
      return thunkAPI.rejectWithValue(msg);
    }
  }
);

const environmentThunks = {
  createEnvironment,
  getProjectEnvironments,
  getEnvironmentById,
  updateEnvironment,
  deleteEnvironment,
  activateEnvironment,
};

export default environmentThunks;
