import mongoose from "mongoose";
import Project from "../models/project.model.js";
import Collection from "../models/collection.model.js";
import Request from "../models/request.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * Middleware to verify that:
 * 1. User is authenticated (req.user.Id).
 * 2. Project exists and belongs to the authenticated user.
 * 3. Collection exists and belongs to the specified project.
 */
export const verifyCollectionAndProject = asyncHandler(async (req, res, next) => {
  const userId = req.user?.Id;
  const projectId = req.params.projectId || req.body.projectId;
  const collectionId = req.params.collectionId || req.body.collection || req.body.collectionId;

  if (!userId) {
    throw new ApiError(401, "Authentication required");
  }

  if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
    throw new ApiError(400, "Invalid project ID format");
  }

  if (!collectionId || !mongoose.Types.ObjectId.isValid(collectionId)) {
    throw new ApiError(400, "Invalid collection ID format");
  }

  // 1. Verify Project & User Ownership
  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  if (project.owner.toString() !== userId.toString()) {
    throw new ApiError(
      403,
      "You are not authorized to access resources in this project"
    );
  }

  // 2. Verify Collection belongs to Project
  const collection = await Collection.findById(collectionId);
  if (!collection) {
    throw new ApiError(404, "Collection not found");
  }

  if (collection.project.toString() !== projectId.toString()) {
    throw new ApiError(
      400,
      "Collection does not belong to the specified project"
    );
  }

  // Attach verified entities to request
  req.project = project;
  req.collection = collection;
  next();
});

/**
 * Middleware to verify that:
 * 1. User is authenticated.
 * 2. Project exists and is owned by the user.
 * 3. Collection exists and belongs to the project.
 * 4. Request exists and belongs to the collection.
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
    throw new ApiError(400, "Invalid project ID format");
  }

  if (!collectionId || !mongoose.Types.ObjectId.isValid(collectionId)) {
    throw new ApiError(400, "Invalid collection ID format");
  }

  if (!requestId || !mongoose.Types.ObjectId.isValid(requestId)) {
    throw new ApiError(400, "Invalid request ID format");
  }

  // 1. Verify Project & User Ownership
  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  if (project.owner.toString() !== userId.toString()) {
    throw new ApiError(
      403,
      "You are not authorized to access resources in this project"
    );
  }

  // 2. Verify Collection belongs to Project
  const collection = await Collection.findById(collectionId);
  if (!collection) {
    throw new ApiError(404, "Collection not found");
  }

  if (collection.project.toString() !== projectId.toString()) {
    throw new ApiError(
      400,
      "Collection does not belong to the specified project"
    );
  }

  // 3. Verify Request belongs to Collection
  const apiRequest = await Request.findById(requestId);
  if (!apiRequest) {
    throw new ApiError(404, "API request endpoint not found");
  }

  if (apiRequest.collection.toString() !== collectionId.toString()) {
    throw new ApiError(
      400,
      "Request endpoint does not belong to the specified collection"
    );
  }

  // Attach verified entities to request
  req.project = project;
  req.collection = collection;
  req.apiRequest = apiRequest;
  next();
});

export default verifyRequestBelongs;
