import mongoose from "mongoose";
import Project from "../models/project.model.js";
import Request from "../models/request.model.js";
import RequestExecution from "../models/RequestExecution.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";


/**
 * Enforces strict 4-step authorization for request execution history queries:
 * 1. Authenticated User
 * 2. Project ownership (User owns Project)
 * 3. Request belongs to Project (Request belongs to a Collection owned by Project)
 * 4. History belongs to Request (Execution record belongs to Request and Project)
 *
 * Never allows /history/:executionId to be fetched solely because the caller knows the execution ID.
 */
export const verifyRequestHistoryAccess = asyncHandler(async (req, res, next) => {
    const userId = req.user?.Id || req.user?._id;
    const { projectId, requestId, executionId } = req.params;

    if (!userId) {
        throw new ApiError(401, "Authentication required");
    }

    if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
        throw new ApiError(404, "Project not found");
    }

    if (!requestId || !mongoose.Types.ObjectId.isValid(requestId)) {
        throw new ApiError(404, "Request not found");
    }

    // 1. Verify Project belongs to authenticated User
    const project = await Project.findOne({
        _id: projectId,
        owner: userId,
    });

    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    // 2. Verify Request belongs to Project (through its parent Collection)
    const apiRequest = await Request.findById(requestId).populate("collection");

    if (!apiRequest) {
        throw new ApiError(404, "Request not found");
    }

    const collectionProject =
        apiRequest.collection?.project?._id || apiRequest.collection?.project;

    if (
        !collectionProject ||
        collectionProject.toString() !== projectId.toString()
    ) {
        throw new ApiError(404, "Request not found in this project");
    }

    // 3. If executionId is provided, verify History record belongs to Request and Project
    if (executionId) {
        if (!mongoose.Types.ObjectId.isValid(executionId)) {
            throw new ApiError(404, "Execution history record not found");
        }

        const execution = await RequestExecution.findOne({
            _id: executionId,
            request: requestId,
            project: projectId,
        });

        if (!execution) {
            throw new ApiError(
                404,
                "Execution history record not found for this request"
            );
        }

        req.execution = execution;
    }

    req.project = project;
    req.apiRequest = apiRequest;

    next();
});

export default verifyRequestHistoryAccess;
