import api from "../lib/axios.js";

const createRequest = async ({ projectId, collectionId, requestDetails }) => {
  const response = await api.post(
    `/projects/${projectId}/collections/${collectionId}/requests`,
    {
      ...requestDetails,
    }
  );
  return response.data;
};

const getCollectionRequests = async ({ projectId, collectionId }) => {
  const response = await api.get(
    `/projects/${projectId}/collections/${collectionId}/requests`
  );
  return response.data;
};

const getRequest = async ({ projectId, collectionId, requestId }) => {
  const response = await api.get(
    `/projects/${projectId}/collections/${collectionId}/requests/${requestId}`
  );
  return response.data;
};

const updateRequest = async ({
  projectId,
  collectionId,
  requestId,
  requestDetails,
}) => {
  const response = await api.patch(
    `/projects/${projectId}/collections/${collectionId}/requests/${requestId}`,
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
  const response = await api.patch(
    `/projects/${projectId}/collections/${collectionId}/requests/${requestId}`,
    {
      auth,
    }
  );
  return response.data;
};

const deleteRequest = async ({ projectId, collectionId, requestId }) => {
  const response = await api.delete(
    `/projects/${projectId}/collections/${collectionId}/requests/${requestId}`
  );
  return response.data;
};

const executeRequest = async (projectId, collectionId, requestId) => {
  const pId = projectId?.projectId || projectId;
  const cId = projectId?.collectionId || collectionId;
  const rId = projectId?.requestId || requestId;

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