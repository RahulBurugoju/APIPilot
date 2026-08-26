import api from "../lib/axios";

const createProject = async (projectData) => {
  const { name, description } = projectData;
  const response = await api.post("/projects/create", { name, description });
  return response.data;
};

const getProjects = async ()=>{
  const response = await api("/projects")
  return response.data
}
const getProject = async({projectId})=>{
  const  response = await api.get(`/projects/${projectId}`)
  return response.data
} 

const projectServices = {
    createProject,
    getProjects,
    getProject
}

export default projectServices
