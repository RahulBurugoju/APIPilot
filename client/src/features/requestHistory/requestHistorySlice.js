import { createSlice } from "@reduxjs/toolkit";
import {
  fetchRequestHistory,
  fetchExecution,
  deleteExecution,
  clearHistory,
} from "./requestHistory.thunk.js";

const initialState = {
  executions: [],
  currentExecution: null,

  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  },

  loading: false,
  error: null,
};

const requestHistorySlice = createSlice({
  name: "requestHistory",
  initialState,
  reducers: {
    clearHistoryError: (state) => {
      state.error = null;
    },
    setCurrentExecution: (state, action) => {
      state.currentExecution = action.payload;
    },
    resetHistoryState: (state) => {
      state.executions = [];
      state.currentExecution = null;
      state.pagination = {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
      };
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchRequestHistory
      .addCase(fetchRequestHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRequestHistory.fulfilled, (state, action) => {
        state.loading = false;
        const payloadData = action.payload?.data || action.payload || {};
        state.executions = payloadData.executions || payloadData.history || [];
        state.pagination = payloadData.pagination || {
          page: 1,
          limit: 20,
          total: state.executions.length,
          totalPages: 1,
        };
      })
      .addCase(fetchRequestHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // fetchExecution
      .addCase(fetchExecution.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExecution.fulfilled, (state, action) => {
        state.loading = false;
        const exec =
          action.payload?.data?.execution ||
          action.payload?.data ||
          action.payload;
        state.currentExecution = exec;
      })
      .addCase(fetchExecution.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // deleteExecution
      .addCase(deleteExecution.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteExecution.fulfilled, (state, action) => {
        state.loading = false;
        const targetId = action.payload?.executionId;
        if (targetId) {
          state.executions = state.executions.filter(
            (e) => (e._id || e.id) !== targetId
          );
          state.pagination.total = Math.max(0, state.pagination.total - 1);
        }
        if (
          state.currentExecution &&
          (state.currentExecution._id || state.currentExecution.id) === targetId
        ) {
          state.currentExecution = null;
        }
      })
      .addCase(deleteExecution.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // clearHistory
      .addCase(clearHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearHistory.fulfilled, (state) => {
        state.loading = false;
        state.executions = [];
        state.currentExecution = null;
        state.pagination = {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0,
        };
      })
      .addCase(clearHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearHistoryError,
  setCurrentExecution,
  resetHistoryState,
} = requestHistorySlice.actions;

export default requestHistorySlice.reducer;
