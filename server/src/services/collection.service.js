import Collection from "../models/collection.model";

const createCollection = async ({
  name,
  description,
  project,
  parent,
  order,
}) => {
  const collection = await Collection.create({
    name,
    description,
    project,
    parent: parent || null,
    order: order ?? 0,
  });
  return collection;
};
// todo check if the project owner == userID
const getProjectCollections = async ({ projectId, userId }) => {
  const collections = await Collection.find({ project: projectId }).sort({
    order: 1,
    createdAt: 1,
  });

  return collections;
};
export default {
  createCollection,
  getProjectCollections,
};
