import { createSlice } from "@reduxjs/toolkit";
import environmentThunks from "./environment.thunk.js";

const initialState = {
  environments: [],
  currentEnvironment: null,
  activeEnvironment: null,
  loading: false,
  error: null,
};

const environmentSlice = createSlice({
  name: "environment",
  initialState,
  reducers: {
    clearEnvironmentError: (state) => {
      state.error = null;
    },
    setCurrentEnvironment: (state, action) => {
      state.currentEnvironment = action.payload;
    },
    setActiveEnvironmentState: (state, action) => {
      state.activeEnvironment = action.payload;
    },
    resetEnvironmentState: (state) => {
      state.environments = [];
      state.currentEnvironment = null;
      state.activeEnvironment = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // createEnvironment
      .addCase(environmentThunks.createEnvironment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(environmentThunks.createEnvironment.fulfilled, (state, action) => {
        state.loading = false;
        const newEnv =
          action.payload?.data?.environment ||
          action.payload?.data?.envirnoment ||
          action.payload?.data;

        if (newEnv) {
          if (newEnv.isActive) {
            state.environments = (state.environments || []).map((env) => ({
              ...env,
              isActive: false,
            }));
            state.activeEnvironment = newEnv;
          }
          state.environments = [newEnv, ...(state.environments || [])];
          state.currentEnvironment = newEnv;
        }
      })
      .addCase(environmentThunks.createEnvironment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // getProjectEnvironments
      .addCase(environmentThunks.getProjectEnvironments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        environmentThunks.getProjectEnvironments.fulfilled,
        (state, action) => {
          state.loading = false;
          const list = action.payload?.data?.environments || [];
          state.environments = list;
          const active = list.find((env) => env.isActive);
          state.activeEnvironment = active || null;
        }
      )
      .addCase(
        environmentThunks.getProjectEnvironments.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
          state.environments = [];
        }
      )

      // getEnvironmentById
      .addCase(environmentThunks.getEnvironmentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        environmentThunks.getEnvironmentById.fulfilled,
        (state, action) => {
          state.loading = false;
          const env =
            action.payload?.data?.environment ||
            action.payload?.data?.envirnoment;
          if (env) {
            state.currentEnvironment = env;
            if (env.isActive) {
              state.activeEnvironment = env;
            }
          }
        }
      )
      .addCase(
        environmentThunks.getEnvironmentById.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      )

      // updateEnvironment
      .addCase(environmentThunks.updateEnvironment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        environmentThunks.updateEnvironment.fulfilled,
        (state, action) => {
          state.loading = false;
          const updated =
            action.payload?.data?.environment ||
            action.payload?.data?.envirnoment;

          if (updated) {
            const updatedId = String(updated._id);
            state.environments = (state.environments || []).map((env) => {
              if (String(env._id) === updatedId) {
                return updated;
              }
              if (updated.isActive) {
                return { ...env, isActive: false };
              }
              return env;
            });

            if (
              state.currentEnvironment &&
              String(state.currentEnvironment._id) === updatedId
            ) {
              state.currentEnvironment = updated;
            }

            if (updated.isActive) {
              state.activeEnvironment = updated;
            } else if (
              state.activeEnvironment &&
              String(state.activeEnvironment._id) === updatedId
            ) {
              state.activeEnvironment = null;
            }
          }
        }
      )
      .addCase(
        environmentThunks.updateEnvironment.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      )

      // deleteEnvironment
      .addCase(environmentThunks.deleteEnvironment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        environmentThunks.deleteEnvironment.fulfilled,
        (state, action) => {
          state.loading = false;
          const deletedId =
            action.payload?.environmentId ||
            action.payload?.response?.data?.environment?._id ||
            (typeof action.meta?.arg === "object"
              ? action.meta?.arg?.environmentId
              : action.meta?.arg);

          if (deletedId) {
            const targetId = String(deletedId);
            state.environments = (state.environments || []).filter(
              (env) => String(env._id) !== targetId
            );

            if (
              state.currentEnvironment &&
              String(state.currentEnvironment._id) === targetId
            ) {
              state.currentEnvironment = null;
            }

            if (
              state.activeEnvironment &&
              String(state.activeEnvironment._id) === targetId
            ) {
              state.activeEnvironment = null;
            }
          }
        }
      )
      .addCase(
        environmentThunks.deleteEnvironment.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      )

      // activateEnvironment
      .addCase(environmentThunks.activateEnvironment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        environmentThunks.activateEnvironment.fulfilled,
        (state, action) => {
          state.loading = false;
          const activated =
            action.payload?.data?.environment ||
            action.payload?.data?.envirnoment;

          if (activated) {
            const targetId = String(activated._id);
            state.environments = (state.environments || []).map((env) => {
              if (String(env._id) === targetId) {
                return { ...env, ...activated, isActive: true };
              }
              return { ...env, isActive: false };
            });

            state.activeEnvironment = activated;

            if (
              state.currentEnvironment &&
              String(state.currentEnvironment._id) === targetId
            ) {
              state.currentEnvironment = activated;
            }
          }
        }
      )
      .addCase(
        environmentThunks.activateEnvironment.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export const {
  clearEnvironmentError,
  setCurrentEnvironment,
  setActiveEnvironmentState,
  resetEnvironmentState,
} = environmentSlice.actions;

export default environmentSlice.reducer;
