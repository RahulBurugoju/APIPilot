import requestService from "../services/request.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { executeRequest } from "../services/request-execution.service.js";

const createRequest = asyncHandler(async (req, res) => {
  const { projectId, collectionId } = req.params;

  const { name, method, url, headers, queryParams, body, auth, order } = req.body;

  const request = await requestService.createRequest({
    name,
    method,
    url,
    headers,
    queryParams,
    body,
    auth,
    order,
    collectionId: collectionId || req.body.collection,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, { request }, "Request created successfully"));
});

const getCollectionRequests = asyncHandler(async (req, res) => {
  const { projectId, collectionId } = req.params;

  const requests = await requestService.getCollectionRequests({
    collectionId,
    projectId,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, { requests }, "Requests fetched successfully"));
});

const getRequest = asyncHandler(async (req, res) => {
  const { requestId, collectionId } = req.params;

  const request = await requestService.getRequest({ requestId, collectionId });

  return res
    .status(200)
    .json(new ApiResponse(200, { request }, "Request fetched successfully"));
});

const updateRequest = asyncHandler(async (req, res) => {
  const { projectId, collectionId, requestId } = req.params;
  const { name, method, url, headers, queryParams, body, auth, order } = req.body;

  const request = await requestService.updateRequest({
    requestId,
    collectionId,
    name,
    method,
    url,
    headers,
    queryParams,
    body,
    auth,
    order,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { updatedRequest: request },
        "Request updated successfully"
      )
    );
});

const deleteRequest = asyncHandler(async (req, res) => {
  const { projectId, collectionId, requestId } = req.params;

  const request = await requestService.deleteRequest({
    requestId,
    collectionId,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { deletedReqId: request._id },
        "Request deleted successfully"
      )
    );
});

const executeRequestController = asyncHandler(async (req, res) => {
    const { projectId, collectionId, requestId } = req.params;
    const environmentId =
        req.query?.environmentId ||
        req.headers["x-environment-id"] ||
        req.body?.environmentId;

    const userId = req.user?.Id || req.user?._id;

    const result = await executeRequest({
        projectId,
        collectionId,
        requestId,
        environmentId,
        userId,
    });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { result },
                "Request executed successfully"
            )
        );
});


export default {
  createRequest,
  getCollectionRequests,
  getRequest,
  updateRequest,
  deleteRequest,
  executeRequestController,
};