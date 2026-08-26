import api from '../lib/axios.js'

const createCollection = async ({ collectionDetails, projectId }) => {
  const response = await api.post(`/projects/${projectId}/collections`, {
    ...collectionDetails,
  });

  return response.data;
};

const getProjectCollections = async ({ projectId }) => {
  const response = await api.get(`/projects/${projectId}/collections`);
  return response.data;
};


export default {
    createCollection,
    getProjectCollections
}