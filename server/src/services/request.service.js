import Request from "../models/request.model.js";
import { ApiError } from "../utils/ApiError.js";

const createRequest = async ({
  name,
  method,
  url,
  collectionId,
  headers,
  queryParams,
  body,
  auth,
  order,
}) => {
  const request = await Request.create({
    name,
    method,
    url,
    collection: collectionId,
    headers: headers || [],
    queryParams: queryParams || [],
    body: body || { type: "none", content: "" },
    auth: auth || {
      type: "none",
      bearer: { token: "" },
      basic: { username: "", password: "" },
      apiKey: { key: "", value: "", location: "header" },
    },
    order: order ?? 0,
  });

  if (!request) {
    throw new ApiError(500, "Failed to create request");
  }

  return request;
};

const getCollectionRequests = async ({ collectionId }) => {
  const requests = await Request.find({
    collection: collectionId,
  }).sort({ order: 1 });

  return requests || [];
};

const getRequest = async ({ requestId, collectionId }) => {
  const request = await Request.findOne({
    _id: requestId,
    collection: collectionId,
  }).populate(
    "collection",
    "name parent project"
  );

  if (!request) {
    throw new ApiError(404, "Request not found");
  }
  
  return request;
};

const updateRequest = async ({
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
}) => {
  const updateFields = {};

  if (name !== undefined) updateFields.name = name;
  if (method !== undefined) updateFields.method = method;
  if (url !== undefined) updateFields.url = url;
  if (headers !== undefined) updateFields.headers = headers;
  if (queryParams !== undefined) updateFields.queryParams = queryParams;
  if (body !== undefined) updateFields.body = body;
  if (auth !== undefined) updateFields.auth = auth;
  if (order !== undefined) updateFields.order = order;

  const request = await Request.findOneAndUpdate(
    {
      _id: requestId,
      collection: collectionId,
    },
    { $set: updateFields },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!request) {
    throw new ApiError(404, "Request not found");
  }

  return request;
};

const deleteRequest = async ({ requestId, collectionId }) => {
  const request = await Request.findOneAndDelete({
    _id: requestId,
    collection: collectionId,
  });

  if (!request) {
    throw new ApiError(404, "Request not found");
  }

  return request;
};

export default {
  createRequest,
  getCollectionRequests,
  getRequest,
  updateRequest,
  deleteRequest,
};