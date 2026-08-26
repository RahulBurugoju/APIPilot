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

const getCurrentProject = async ({ projectId,userId }) => {
  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, "failed to get project");
  }
  if (project.owner.toString() !== userId.toString()) {
    throw new ApiError(401, "you are not authorized to get this project");
  }
  return project;
};

const getUserProjects = async ({ userId }) => {
  const projects = await Project.find({
    owner: userId,
  }).sort({
    updatedAt: -1,
  });

  return projects || [];
};

export default {
  createProject,
  updateProject,
  deleteProject,
  getCurrentProject,
  getUserProjects,
};
