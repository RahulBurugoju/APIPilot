import RequestExecution from "../models/RequestExecution.model.js";
import { ApiError } from "../utils/ApiError.js";


const createExecution = async ({
    userId,
    projectId,
    collectionId,
    requestId,
    environmentId = null,
    requestSnapshot,
    response = null,
    success = false,
    error = null,
}) => {
    if (!userId) {
        throw new ApiError(400, "User ID is required to record execution history");
    }

    if (!projectId) {
        throw new ApiError(400, "Project ID is required to record execution history");
    }

    if (!collectionId) {
        throw new ApiError(400, "Collection ID is required to record execution history");
    }

    if (!requestId) {
        throw new ApiError(400, "Request ID is required to record execution history");
    }

    if (!requestSnapshot) {
        throw new ApiError(400, "Request snapshot is required to record execution history");
    }

    const execution = await RequestExecution.create({
        user: userId,
        project: projectId,
        collection: collectionId,
        request: requestId,
        environment: environmentId || null,
        requestSnapshot,
        response: response || null,
        success: Boolean(success),
        error: error || null,
    });

    if (!execution) {
        throw new ApiError(500, "Failed to record request execution history");
    }

    return execution;
};


const getRequestHistory = async ({
    requestId,
    projectId,
    userId,
    limit = 50,
}) => {
    const query = {};

    if (requestId) {
        query.request = requestId;
    }

    if (projectId) {
        query.project = projectId;
    }

    if (userId) {
        query.user = userId;
    }

    const history = await RequestExecution.find(query)
        .sort({ createdAt: -1 })
        .limit(Number(limit))
        .populate("environment", "name isActive")
        .populate("request", "name method url");

    return history || [];
};


const getExecutionById = async ({
    executionId,
    projectId,
    userId,
}) => {
    const query = {
        _id: executionId,
    };

    if (projectId) {
        query.project = projectId;
    }

    if (userId) {
        query.user = userId;
    }

    const execution = await RequestExecution.findOne(query)
        .populate("environment", "name isActive")
        .populate("request", "name method url")
        .populate("collection", "name");

    if (!execution) {
        throw new ApiError(404, "Execution history record not found");
    }

    return execution;
};


const deleteExecution = async ({
    executionId,
    projectId,
    userId,
}) => {
    const query = {
        _id: executionId,
    };

    if (projectId) {
        query.project = projectId;
    }

    if (userId) {
        query.user = userId;
    }

    const deletedExecution = await RequestExecution.findOneAndDelete(query);

    if (!deletedExecution) {
        throw new ApiError(404, "Execution history record not found or already deleted");
    }

    return deletedExecution;
};


const clearRequestHistory = async ({
    requestId,
    projectId,
    userId,
}) => {
    const query = {};

    if (requestId) {
        query.request = requestId;
    }

    if (projectId) {
        query.project = projectId;
    }

    if (userId) {
        query.user = userId;
    }

    if (Object.keys(query).length === 0) {
        throw new ApiError(
            400,
            "At least one filter (requestId, projectId, or userId) is required to clear history"
        );
    }

    const deleteResult = await RequestExecution.deleteMany(query);

    return {
        deletedCount: deleteResult.deletedCount || 0,
    };
};


export {
    createExecution,
    getRequestHistory,
    getExecutionById,
    deleteExecution,
    clearRequestHistory,
};

export default {
    createExecution,
    getRequestHistory,
    getExecutionById,
    deleteExecution,
    clearRequestHistory,
};
