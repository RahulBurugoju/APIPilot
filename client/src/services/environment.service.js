import api from "../lib/axios.js";

const createEnvironment = async ({ projectId, environmentDetails }) => {
  const response = await api.post(
    `/projects/${projectId}/environments`,
    environmentDetails
  );
  return response.data;
};

const getProjectEnvironments = async ({ projectId }) => {
  const response = await api.get(`/projects/${projectId}/environments`);
  return response.data;
};

const getEnvironmentById = async ({ projectId, environmentId }) => {
  const response = await api.get(
    `/projects/${projectId}/environments/${environmentId}`
  );
  return response.data;
};

const updateEnvironment = async ({
  projectId,
  environmentId,
  environmentDetails,
}) => {
  const response = await api.patch(
    `/projects/${projectId}/environments/${environmentId}`,
    environmentDetails
  );
  return response.data;
};

const deleteEnvironment = async ({ projectId, environmentId }) => {
  const response = await api.delete(
    `/projects/${projectId}/environments/${environmentId}`
  );
  return response.data;
};

const setActiveEnvironment = async ({ projectId, environmentId }) => {
  const response = await api.patch(
    `/projects/${projectId}/environments/${environmentId}/activate`
  );
  return response.data;
};

export default {
  createEnvironment,
  getProjectEnvironments,
  getEnvironmentById,
  updateEnvironment,
  deleteEnvironment,
  setActiveEnvironment,
  activateEnvironment: setActiveEnvironment,
};
