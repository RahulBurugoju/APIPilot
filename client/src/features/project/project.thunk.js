import { createAsyncThunk } from "@reduxjs/toolkit";
import projectServices from "../../services/project.service.js";

const createProject = createAsyncThunk(
  "projects/createProject",
  async (projectData, { rejectWithValue }) => {
    try {
      const data = await projectServices.createProject(projectData);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong while creating project");
    }
  },
);

const projectThunks = {
    createProject
}

export default projectThunks
