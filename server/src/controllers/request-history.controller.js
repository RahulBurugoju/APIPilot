import requestExecutionHistoryService from "../services/request-execution-history.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const getRequestHistory = asyncHandler(async (req, res) => {
    const { projectId, requestId } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const userId = req.user?.Id || req.user?._id;

    const { executions, pagination } =
        await requestExecutionHistoryService.getRequestHistory({
            projectId,
            requestId,
            userId,
            page,
            limit,
        });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { executions, pagination },
                "Request execution history retrieved successfully"
            )
        );
});


const getExecutionById = asyncHandler(async (req, res) => {
    const { executionId, projectId, requestId } = req.params;
    const userId = req.user?.Id || req.user?._id;

    // Use verified execution from middleware if present, or query via service
    const execution =
        req.execution ||
        (await requestExecutionHistoryService.getExecutionById({
            executionId,
            projectId,
            userId,
        }));

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { execution },
                "Execution history record retrieved successfully"
            )
        );
});


const deleteExecution = asyncHandler(async (req, res) => {
    const { executionId, projectId } = req.params;
    const userId = req.user?.Id || req.user?._id;

    const deleted = await requestExecutionHistoryService.deleteExecution({
        executionId,
        projectId,
        userId,
    });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    execution: deleted,
                    deletedExecutionId: deleted._id,
                },
                "Execution history record deleted successfully"
            )
        );
});


const clearRequestHistory = asyncHandler(async (req, res) => {
    const { projectId, requestId } = req.params;
    const userId = req.user?.Id || req.user?._id;

    const result = await requestExecutionHistoryService.clearRequestHistory({
        projectId,
        requestId,
        userId,
    });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                result,
                "Request execution history cleared successfully"
            )
        );
});


export default {
    getRequestHistory,
    getExecutionById,
    deleteExecution,
    clearRequestHistory,
};
