import api from "../lib/axios.js";

const extractId = (val) => {
  if (!val) return "";
  if (typeof val === "string") return val;
  if (typeof val === "object") return val._id || val.id || "";
  return String(val);
};

const getRequestHistory = async ({ projectId, requestId, page = 1, limit = 20 }) => {
  const pId = extractId(projectId);
  const rId = extractId(requestId);
  const response = await api.get(
    `/projects/${pId}/requests/${rId}/history`,
    {
      params: { page, limit },
    }
  );
  return response.data;
};

const getExecutionById = async ({ projectId, requestId, executionId }) => {
  const pId = extractId(projectId);
  const rId = extractId(requestId);
  const eId = extractId(executionId);
  const response = await api.get(
    `/projects/${pId}/requests/${rId}/history/${eId}`
  );
  return response.data;
};

const deleteExecution = async ({ projectId, requestId, executionId }) => {
  const pId = extractId(projectId);
  const rId = extractId(requestId);
  const eId = extractId(executionId);
  const response = await api.delete(
    `/projects/${pId}/requests/${rId}/history/${eId}`
  );
  return response.data;
};

const clearRequestHistory = async ({ projectId, requestId }) => {
  const pId = extractId(projectId);
  const rId = extractId(requestId);
  const response = await api.delete(
    `/projects/${pId}/requests/${rId}/history`
  );
  return response.data;
};


export default {
  getRequestHistory,
  getExecutionById,
  deleteExecution,
  clearRequestHistory,
};
