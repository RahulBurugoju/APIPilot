import Project from "../models/project.model.js";
import { ApiError } from "../utils/ApiError.js";

const createProject = async ({ name, description, owner }) => {
  const project = await Project.create({
    name,
    description,
    owner,
  });

  if (!project) {
    throw new ApiError(400, "failed to create project");
  }

  return project;
};

const updateProject = async ({ projectId, updatePayload }) => {
  const project = await Project.findByIdAndUpdate(projectId, updatePayload, {
    new: true,
    runValidators: true,
  });

  if (!project) {
    throw new ApiError(400, "failed to update project");
  }
  return project;
};

const deleteProject = async ({ projectId }) => {
  const project = await Project.findByIdAndDelete(projectId);

  if (!project) {
    throw new ApiError(400, "failed to delete project");
  }
  return project;
};

const getCurrentProject = async ({ projectId }) => {
  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(400, "failed to get project");
  }
  return project;
};

const getUserProjects = async ({ userId }) => {
  const projects = await Project.find({
    owner: userId,
  }).sort({
    updatedAt: -1,
  });

  if (projects.length === 0) {
    throw new ApiError(404, "projects not found");
  }
  return projects;
};

export default {
  createProject,
  updateProject,
  deleteProject,
  getCurrentProject,
  getUserProjects,
};
