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
        state.error = null;
      })
      .addCase(projectThunks.createProject.fulfilled, (state, action) => {
        state.loading = false;
        const newProj = action.payload?.data?.project;
        state.currentProject = newProj;
        if (newProj) {
          state.projects = [newProj, ...(state.projects || [])];
        }
      })
      .addCase(projectThunks.createProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(projectThunks.getProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(projectThunks.getProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload?.data?.projects || [];
      })
      .addCase(projectThunks.getProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.projects = state.projects || [];
      })
      .addCase(projectThunks.getProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(projectThunks.getProject.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProject = action.payload?.data?.project;
      })
      .addCase(projectThunks.getProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.currentProject = state.currentProject || null;
      })
      .addCase(updateProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.loading = false;

        const updatedProject = action.payload.data.project;

        const index = state.projects.findIndex(
          (project) => project._id === updatedProject._id,
        );

        if (index !== -1) {
          state.projects[index] = updatedProject;
        }

        if (state.currentProject?._id === updatedProject._id) {
          state.currentProject = updatedProject;
        }
      })
      .addCase(deleteProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.currentProject = state.currentProject || null;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.loading = false;

        const deletedProjectId =
          action.meta.arg || action.payload?.data?.projectId;

        state.projects = state.projects.filter(
          (project) => project._id !== deletedProjectId,
        );

        if (state.currentProject?._id === deletedProjectId) {
          state.currentProject = null;
        }
      });
  },
});

export const { clearProjectError, resetCurrentProject } = projectSlice.actions;

export default projectSlice.reducer;
