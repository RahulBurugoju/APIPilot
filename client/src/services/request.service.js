import api from "../lib/axios.js";

const extractId = (val) => {
  if (!val) return "";
  if (typeof val === "string") return val;
  if (typeof val === "object") return val._id || val.id || "";
  return String(val);
};

const createRequest = async ({ projectId, collectionId, requestDetails }) => {
  const pId = extractId(projectId);
  const cId = extractId(collectionId);
  const response = await api.post(
    `/projects/${pId}/collections/${cId}/requests`,
    {
      ...requestDetails,
    }
  );
  return response.data;
};

const getCollectionRequests = async ({ projectId, collectionId }) => {
  const pId = extractId(projectId);
  const cId = extractId(collectionId);
  const response = await api.get(
    `/projects/${pId}/collections/${cId}/requests`
  );
  return response.data;
};

const getRequest = async ({ projectId, collectionId, requestId }) => {
  const pId = extractId(projectId);
  const cId = extractId(collectionId);
  const rId = extractId(requestId);
  const response = await api.get(
    `/projects/${pId}/collections/${cId}/requests/${rId}`
  );
  return response.data;
};

const updateRequest = async ({
  projectId,
  collectionId,
  requestId,
  requestDetails,
}) => {
  const pId = extractId(projectId);
  const cId = extractId(collectionId);
  const rId = extractId(requestId);
  const response = await api.patch(
    `/projects/${pId}/collections/${cId}/requests/${rId}`,
    {
      ...requestDetails,
    }
  );
  return response.data;
};

const updateRequestAuth = async ({
  projectId,
  collectionId,
  requestId,
  auth,
}) => {
  const pId = extractId(projectId);
  const cId = extractId(collectionId);
  const rId = extractId(requestId);
  const response = await api.patch(
    `/projects/${pId}/collections/${cId}/requests/${rId}`,
    {
      auth,
    }
  );
  return response.data;
};

const deleteRequest = async ({ projectId, collectionId, requestId }) => {
  const pId = extractId(projectId);
  const cId = extractId(collectionId);
  const rId = extractId(requestId);
  const response = await api.delete(
    `/projects/${pId}/collections/${cId}/requests/${rId}`
  );
  return response.data;
};

const executeRequest = async (projectId, collectionId, requestId) => {
  const pId = extractId(projectId?.projectId || projectId);
  const cId = extractId(projectId?.collectionId || collectionId);
  const rId = extractId(projectId?.requestId || requestId);

  const response = await api.post(
    `/projects/${pId}/collections/${cId}/requests/${rId}/execute`
  );

  return response.data;
};

export default {
  createRequest,
  getCollectionRequests,
  getRequest,
  updateRequest,
  updateRequestAuth,
  deleteRequest,
  executeRequest,
};