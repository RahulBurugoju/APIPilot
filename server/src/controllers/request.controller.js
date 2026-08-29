import requestService from "../services/request.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createRequest = asyncHandler(async (req, res) => {
  const { projectId, collectionId } = req.params;

  const { name, method, url, headers, queryParams, body, order } = req.body;

  const request = await requestService.createRequest({
    name,
    method,
    url,
    headers,
    queryParams,
    body,
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
  const { name, method, url, headers, queryParams, body, order } = req.body;

  const request = await requestService.updateRequest({
    requestId,
    collectionId,
    name,
    method,
    url,
    headers,
    queryParams,
    body,
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
        { deletedRequest: request },
        "Request deleted successfully"
      )
    );
});

export default {
  createRequest,
  getCollectionRequests,
  getRequest,
  updateRequest,
  deleteRequest,
};