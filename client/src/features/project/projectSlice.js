import { createSlice } from "@reduxjs/toolkit";
import projectThunks from "./project.thunk";

const initialState = {
  projects: [],
  currentProject: null,
  loading: false,
  error: null,
};

const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    clearProjectError: (state) => {
      state.error = null;
    },
    resetCurrentProject: (state) => {
      state.currentProject = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(projectThunks.createProject.pending, (state) => {
        state.loading = true;
        state.error=null;
      })
      .addCase(projectThunks.createProject.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProject = action.payload?.data?.project;
        state.projects.push(action.payload?.data?.project);
      })
      .addCase(projectThunks.createProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearProjectError, resetCurrentProject } = projectSlice.actions;

export default projectSlice.reducer;
