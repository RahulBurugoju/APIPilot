import { createAsyncThunk } from "@reduxjs/toolkit";
import projectServices from "../../services/project.service.js";

const createProject = createAsyncThunk(
  "projects/createProject",
  async (projectData, { rejectWithValue }) => {
    try {
      const data = await projectServices.createProject(projectData);
      return data;
    } catch (error) {
      const msg = error?.response?.data?.message || error?.message || "Something went wrong while creating project";
      return rejectWithValue(msg);
    }
  },
);

const getProjects = createAsyncThunk(
  "projects/getProjects",
  async(_, {rejectWithValue})=>{
    try {
      const data = await projectServices.getProjects();
      return data
    } catch (error) {
      const msg = error?.response?.data?.message || error?.message || "Something went wrong while fetching projects";
      return rejectWithValue(msg);
    }
  }
) 

const getProject = createAsyncThunk('projects/getProject',async({projectId},{rejectWithValue})=>{

  try{

    const data = await projectServices.getProject({projectId})
    return data;
  }
  catch(error){
    const msg = error?.response?.data?.message || error?.message || "Something went wrong while fetching project";
    return rejectWithValue(msg);
  }
})

const projectThunks = {
    createProject,
    getProjects,
    getProject
}

export default projectThunks
