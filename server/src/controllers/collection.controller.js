import collectionService from "../services/collection.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createCollection = asyncHandler(async (req, res) => {
  const userId = req.user?.Id;
  const { name, description, parent, projectId } = req.body;

  const collection = await collectionService.createCollection({
    name,
    description,
    project: projectId,
    parent,
    order,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, {collection}, "Collection created successfully"));
});

const getProjectCollections = asyncHandler(async (req, res) => {
  const userId = req.user?.Id;
  const projectId = req.params.projectId;

  const collections = await collectionService.getProjectCollections({
    projectId,
    userId,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {collections}, "Collections fetched successfully"));
});


export default {
    createCollection,
    getProjectCollections
}

