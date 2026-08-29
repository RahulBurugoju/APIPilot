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

const deleteRequest = async ({ projectId, collectionId, requestId }) => {
  const response = await api.delete(
    `/projects/${projectId}/collections/${collectionId}/requests/${requestId}`
  );
  return response.data;
};

export default {
  createRequest,
  getCollectionRequests,
  getRequest,
  updateRequest,
  deleteRequest,
};