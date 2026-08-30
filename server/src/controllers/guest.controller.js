import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import { executeDirectRequest } from "../services/request-execution.service.js";

const executeGuestRequest = asyncHandler(async (req, res) => {
    const {
        method = "GET",
        url,
        headers = [],
        queryParams = [],
        body = {},
        auth = null,
    } = req.body || {};

    if (!url || typeof url !== "string" || !url.trim()) {
        throw new ApiError(400, "URL is required for execution");
    }

    const result = await executeDirectRequest({
        method,
        url,
        headers,
        queryParams,
        body,
        auth,
        timeout: 15000,
    });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                result,
                "Guest request executed successfully"
            )
        );
});

export default {
    executeGuestRequest,
};
