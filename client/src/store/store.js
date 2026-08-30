import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice.js";
import projectReducer from "../features/project/projectSlice.js";
import collectionReducer from "../features/collection/collectionSlice.js";
import requestReducer from "../features/request/requestSlice.js";
import environmentReducer from "../features/environment/environmentSlice.js";
import requestHistoryReducer from "../features/requestHistory/requestHistorySlice.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    project: projectReducer,
    collection: collectionReducer,
    request: requestReducer,
    environment: environmentReducer,
    requestHistory: requestHistoryReducer,
  },
});