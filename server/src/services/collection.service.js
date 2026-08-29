import mongoose from "mongoose";
import Collection from "../models/collection.model.js";
import { ApiError } from "../utils/ApiError.js";
import Project from "../models/project.model.js";
const isDescendant = async ({
  collectionId,
  potentialParentId,
  projectId,
}) => {
  let currentId = potentialParentId;

  while (currentId) {
    const current = await Collection.findOne({
      _id: currentId,
      project: projectId,
    }).select("parent");

    if (!current) {
      return false;
    }

    if (current._id.toString() === collectionId.toString()) {
      return true;
    }

    currentId = current.parent;
  }

  return false;
};

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

  if (parent) {
    if (!mongoose.Types.ObjectId.isValid(parent)) {
      throw new ApiError(400, "Invalid parent collection ID format");
    }
    const parentCollection = await Collection.findOne({
      _id: parent,
      project,
    });
    if (!parentCollection) {
      throw new ApiError(400, "Invalid parent collection");
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

const updateCollection = async ({
  collectionId,
  projectId,
  name,
  description,
  parent,
  order,
}) => {
  if (!mongoose.Types.ObjectId.isValid(collectionId)) {
    throw new ApiError(400, "Invalid collection ID format");
  }

  if (parent) {
    if (!mongoose.Types.ObjectId.isValid(parent)) {
      throw new ApiError(400, "Invalid parent collection ID format");
    }

    if (parent.toString() === collectionId.toString()) {
      throw new ApiError(400, "Collection cannot be its own parent");
    }

    const parentCollection = await Collection.findOne({
      _id: parent,
      project: projectId,
    });

    if (!parentCollection) {
      throw new ApiError(400, "Invalid parent collection");
    }

    if (
      await isDescendant({
        collectionId,
        potentialParentId: parent,
        projectId,
      })
    ) {
      throw new ApiError(400, "Invalid collection hierarchy");
    }
  }

  const updateData = {};
  if (name !== undefined) updateData.name = name;
  if (description !== undefined) updateData.description = description;
  if (parent !== undefined) updateData.parent = parent || null;
  if (order !== undefined) updateData.order = Number(order);

  const collection = await Collection.findOneAndUpdate(
    { _id: collectionId, project: projectId },
    { $set: updateData },
    { new: true, runValidators: true }
  );

  if (!collection) {
    throw new ApiError(404, "Collection not found");
  }

  return collection;
};

const deleteCollection = async ({ collectionId, projectId }) => {
  if (!mongoose.Types.ObjectId.isValid(collectionId)) {
    throw new ApiError(400, "Invalid collection ID format");
  }

  const collection = await Collection.findOneAndDelete({
    _id: collectionId,
    project: projectId,
  });

  if (!collection) {
    throw new ApiError(404, "Collection not found");
  }

  // Child Promotion: Re-assign children of deleted collection to the deleted collection's parent
  await Collection.updateMany(
    { parent: collectionId, project: projectId },
    { $set: { parent: collection.parent || null } }
  );

  return collection;
};

export default {
  createCollection,
  getProjectCollections,
  updateCollection,
  deleteCollection,
};


