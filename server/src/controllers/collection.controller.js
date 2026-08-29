import collectionService from "../services/collection.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createCollection = asyncHandler(async (req, res) => {
  const userId = req.user?.Id;
  const { projectId } = req.params;
  const { name, description, parent, order } = req.body;

  const collection = await collectionService.createCollection({
    name,
    description,
    project: projectId,
    parent,
    order,
    userId,
  });

  return res
    .status(201)
    .json(
      new ApiResponse(201, { collection }, "Collection created successfully"),
    );
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
    .json(
      new ApiResponse(200, { collections }, "Collections fetched successfully"),
    );
});

const updateCollection = asyncHandler(async (req, res) => {
  const { projectId, collectionId } = req.params;
  const { name, description, parent, order } = req.body;

  const updatedCollection = await collectionService.updateCollection({
    collectionId,
    projectId,
    name,
    description,
    parent,
    order,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, { updatedCollection }, "Collection updated successfully")
    );
});

const deleteCollection = asyncHandler(async(req,res) => {
  const {projectId, collectionId} = req.params;

  const deletedCollection = await collectionService.deleteCollection({
    collectionId,
    projectId
  })
  return res
    .status(200)
    .json(
      new ApiResponse(200, { deletedCollectionId:deletedCollection?._id }, "Collection deleted successfully")
    );
})

export default {
  createCollection,
  getProjectCollections,
  updateCollection,
  deleteCollection
};

