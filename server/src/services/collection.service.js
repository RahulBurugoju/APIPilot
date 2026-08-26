import mongoose from "mongoose";
import Collection from "../models/collection.model.js";
import { ApiError } from "../utils/ApiError.js";
import Project from "../models/project.model.js";
const createCollection = async ({
  name,
  description,
  project,
  parent,
  order,
  userId,
}) => {
  if (!mongoose.Types.ObjectId.isValid(project)) {
    throw new ApiError(400, "Invalid project ID format");
  }

  if (userId) {
    const existingProject = await Project.findById(project);
    if (!existingProject) {
      throw new ApiError(404, "Project not found");
    }
    if (existingProject.owner.toString() !== userId.toString()) {
      throw new ApiError(403, "You are not authorized to add collections to this project");
    }
  }

  const collection = await Collection.create({
    name,
    description,
    project,
    parent: parent || null,
    order: order ?? 0,
  });

  if (!collection) {
    throw new ApiError(400, "failed to create collection");
  }
  return collection;
};
// todo check if the project owner == userID
const getProjectCollections = async ({ projectId, userId }) => {

  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "No collections found for this project");
  }
  if (project.owner.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not authorized to view this project");
  }

  const collections = await Collection.find({ project: projectId }).sort({
    order: 1,
    createdAt: 1,
  });

  return collections || [];
};
export default {
  createCollection,
  getProjectCollections,
};
