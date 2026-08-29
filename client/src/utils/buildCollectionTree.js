/**
 * Transforms a flat array of collection objects into a nested tree structure.
 * 
 * Each collection item should have `_id` and optional `parent` (null or string/ObjectId).
 * Top-level items (where `parent` is null, undefined, or missing in map) become root nodes.
 * Nodes at every level are sorted by `order` (ascending), then by `name` (alphabetical).
 *
 * @param {Array} collections - Flat array of collection objects.
 * @returns {Array} Nested tree structure of collections, each with a `children` array.
 */
export const buildCollectionTree = (collections = []) => {
  if (!Array.isArray(collections) || collections.length === 0) {
    return [];
  }

  const collectionMap = new Map();
  const roots = [];

  // Step 1: Clone collection items and initialize children array
  collections.forEach((item) => {
    if (item && item._id) {
      const idStr = String(item._id);
      collectionMap.set(idStr, {
        ...item,
        children: [],
      });
    }
  });

  // Step 2: Assemble parent-child relations
  collectionMap.forEach((node) => {
    const parentId = node.parent ? String(node.parent) : null;

    if (parentId && collectionMap.has(parentId)) {
      collectionMap.get(parentId).children.push(node);
    } else {
      roots.push(node);
    }
  });

  // Helper function to recursively sort nodes by order and name
  const sortNodes = (nodes) => {
    nodes.sort((a, b) => {
      const orderA = typeof a.order === "number" ? a.order : 0;
      const orderB = typeof b.order === "number" ? b.order : 0;
      if (orderA !== orderB) {
        return orderA - orderB;
      }
      return (a.name || "").localeCompare(b.name || "");
    });

    nodes.forEach((node) => {
      if (node.children && node.children.length > 0) {
        sortNodes(node.children);
      }
    });
  };

  sortNodes(roots);
  return roots;
};

export default buildCollectionTree;
