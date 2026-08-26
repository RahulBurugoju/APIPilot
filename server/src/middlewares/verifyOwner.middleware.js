import mongoose from "mongoose";
import Project from "../models/project.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const verifyProjectOwner = asyncHandler(async (req, res, next) => {
  const userId = req.user?.Id;
  const projectId = req.params.projectId;

  if (!userId) {
    throw new ApiError(401, "Authentication required");
  }

  if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
    throw new ApiError(400, "Invalid project ID format");
  }

  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  if (project.owner.toString() !== userId.toString()) {
    throw new ApiError(
      403,
      "You are not authorized to access or modify resources in this project"
    );
  }

  // Attach verified project to request object for downstream controllers
  req.project = project;
  next();
});

export default verifyProjectOwner;
