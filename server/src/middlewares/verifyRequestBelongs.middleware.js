import mongoose from "mongoose";
import Project from "../models/project.model.js";
import Collection from "../models/collection.model.js";
import Request from "../models/request.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * Verifies the parent authorization chain: req.user -> Project -> Collection
 * Throws 404 Not Found if any link in the chain fails to prevent information disclosure.
 */
export const verifyCollectionAndProject = asyncHandler(async (req, res, next) => {
  const userId = req.user?.Id;
  const projectId = req.params.projectId || req.body.projectId;
  const collectionId = req.params.collectionId || req.body.collection || req.body.collectionId;

  if (!userId) {
    throw new ApiError(401, "Authentication required");
  }

  if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
    throw new ApiError(404, "Project not found");
  }

  if (!collectionId || !mongoose.Types.ObjectId.isValid(collectionId)) {
    throw new ApiError(404, "Collection not found");
  }

  // 1. Verify Project belongs to authenticated User (returns 404 if missing or unowned)
  const project = await Project.findOne({ _id: projectId, owner: userId });
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  // 2. Verify Collection belongs to Project (returns 404 if missing or not in project)
  const collection = await Collection.findOne({ _id: collectionId, project: projectId });
  if (!collection) {
    throw new ApiError(404, "Collection not found");
  }

  // Attach verified entities to request
  req.project = project;
  req.collection = collection;
  next();
});

/**
 * Verifies the full authorization chain: req.user -> Project -> Collection -> Request
 * Throws 404 Not Found if any link in the chain fails to prevent information disclosure.
 */
export const verifyRequestBelongs = asyncHandler(async (req, res, next) => {
  const userId = req.user?.Id;
  const projectId = req.params.projectId || req.body.projectId;
  const collectionId = req.params.collectionId || req.body.collection || req.body.collectionId;
  const requestId = req.params.requestId || req.body.requestId;

  if (!userId) {
    throw new ApiError(401, "Authentication required");
  }

  if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
    throw new ApiError(404, "Project not found");
  }

  if (!collectionId || !mongoose.Types.ObjectId.isValid(collectionId)) {
    throw new ApiError(404, "Collection not found");
  }

  if (!requestId || !mongoose.Types.ObjectId.isValid(requestId)) {
    throw new ApiError(404, "Request not found");
  }

  // 1. Verify Project belongs to authenticated User
  const project = await Project.findOne({ _id: projectId, owner: userId });
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  // 2. Verify Collection belongs to Project
  const collection = await Collection.findOne({ _id: collectionId, project: projectId });
  if (!collection) {
    throw new ApiError(404, "Collection not found");
  }

  // 3. Verify Request belongs to Collection
  const apiRequest = await Request.findOne({ _id: requestId, collection: collectionId });
  if (!apiRequest) {
    throw new ApiError(404, "Request not found");
  }

  // Attach verified entities to request
  req.project = project;
  req.collection = collection;
  req.apiRequest = apiRequest;
  next();
});

export default verifyRequestBelongs;
