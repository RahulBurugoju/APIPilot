import mongoose from "mongoose";
import Project from "../models/project.model.js";
import { ApiError } from "../utils/ApiError.js";

const createProject = async ({
  name,
  description,
  owner,
  baseUrl,
  projectType,
  settings,
}) => {
  const project = await Project.create({
    name,
    description,
    owner,
    baseUrl,
    projectType,
    settings,
  });

  if (!project) {
    throw new ApiError(400, "failed to create project");
  }

  return project;
};

const updateProject = async ({
  projectId,
  owner,
  name,
  description,
  baseUrl,
  projectType,
  settings,
}) => {
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new ApiError(400, "Invalid project ID format");
  }

  const updateFields = {};
  if (name !== undefined) updateFields.name = name;
  if (description !== undefined) updateFields.description = description;
  if (baseUrl !== undefined) updateFields.baseUrl = baseUrl;
  if (projectType !== undefined) updateFields.projectType = projectType;
  if (settings !== undefined) updateFields.settings = settings;

  const project = await Project.findOneAndUpdate(
    {
      _id: projectId,
      owner,
    },
    {
      $set: updateFields,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  return project;
};

const deleteProject = async ({ projectId,owner }) => {
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new ApiError(400, "Invalid project ID format");
  }

  const project = await Project.findOneAndDelete({
    _id: projectId,
    owner,
  });

  if (!project) {       
    throw new ApiError(404, "Project not found or you are not authorized to delete");
  }
  return project;
};

const getCurrentProject = async ({ projectId, userId }) => {
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new ApiError(400, "Invalid project ID format");
  }

  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }
  if (project.owner.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not authorized to view this project");
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
