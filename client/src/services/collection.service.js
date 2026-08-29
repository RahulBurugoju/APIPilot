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

const updateCollection = async({projectId,collectionId,collectionDetails})=>{

  const response =  await api.patch(`/projects/${projectId}/collections/${collectionId}`,collectionDetails)

  return response.data
}

const deleteCollection = async({projectId,collectionId})=>{
   const response = await api.delete(`/projects/${projectId}/collections/${collectionId}`)
   return response.data
}

export default {
    createCollection,
    getProjectCollections,
    updateCollection,
    deleteCollection
}