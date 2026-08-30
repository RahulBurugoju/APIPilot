import React, { useState, useMemo } from "react";
import {
  Plus,
  Search,
  ChevronsDown,
  ChevronsUp,
  FolderTree,
} from "lucide-react";
import { buildCollectionTree } from "../../utils/buildCollectionTree";
import CollectionTreeNode from "./CollectionTreeNode";

/**
 * CollectionTree Component
 */
export function CollectionTree({
  collections = [],
  requests = [],
  selectedCollectionId = null,
  selectedRequestId = null,
  onSelectCollection = null,
  onSelectRequest = null,
  onCreateSubCollection = null,
  onEditCollection = null,
  onDeleteCollection = null,
  onCreateRootCollection = null,
  onAddRequest = null,
  loading = false,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedNodes, setExpandedNodes] = useState({});

  // 1. Build nested tree if input collections are flat
  const treeData = useMemo(() => {
    const isAlreadyTree = collections.some((c) => Array.isArray(c.children));
    if (isAlreadyTree) {
      return collections;
    }
    return buildCollectionTree(collections);
  }, [collections]);

  // 2. Filter tree by search query
  const filteredTree = useMemo(() => {
    if (!searchQuery.trim()) return treeData;

    const query = searchQuery.toLowerCase();
    const filterNodes = (nodes) => {
      return nodes.reduce((acc, node) => {
        const matchesSelf = node.name?.toLowerCase().includes(query);
        const filteredChildren = node.children ? filterNodes(node.children) : [];

        if (matchesSelf || filteredChildren.length > 0) {
          acc.push({
            ...node,
            children: filteredChildren,
          });
        }
        return acc;
      }, []);
    };

    return filterNodes(treeData);
  }, [treeData, searchQuery]);

  const toggleExpand = (nodeId) => {
    setExpandedNodes((prev) => ({
      ...prev,
      [nodeId]: !prev[nodeId],
    }));
  };

  const expandAll = () => {
    const newExpanded = {};
    const traverse = (nodes) => {
      nodes.forEach((n) => {
        newExpanded[n._id] = true;
        if (n.children && n.children.length > 0) traverse(n.children);
      });
    };
    traverse(treeData);
    setExpandedNodes(newExpanded);
  };

  const collapseAll = () => {
    setExpandedNodes({});
  };

  return (
    <div className="flex flex-col h-full bg-[#FFFFFF] dark:bg-[#141416] border border-[#E6D2A5] dark:border-[#2C2C2E] rounded-lg shadow-xs overflow-hidden">


      {/* Tree Content Area */}
      <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {loading ? (
          <div className="space-y-2 p-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-7 rounded bg-[#E6D2A5]/40 dark:bg-[#1C1C1F] animate-pulse"
              />
            ))}
          </div>
        ) : filteredTree.length > 0 ? (
          filteredTree.map((rootNode) => (
            <CollectionTreeNode
              key={rootNode._id}
              node={rootNode}
              level={0}
              requests={requests}
              selectedCollectionId={selectedCollectionId}
              selectedRequestId={selectedRequestId}
              onSelectCollection={onSelectCollection}
              onSelectRequest={onSelectRequest}
              onCreateSubCollection={onCreateSubCollection}
              onEditCollection={onEditCollection}
              onDeleteCollection={onDeleteCollection}
              onAddRequest={onAddRequest}
              expandedNodes={expandedNodes}
              toggleExpand={toggleExpand}
            />
          ))
        ) : (
          <div className="p-6 text-center space-y-3">
            <div className="w-9 h-9 rounded-full bg-[#FAF3E1] dark:bg-[#1C1C1F] border border-[#E6D2A5] dark:border-[#2C2C2E] flex items-center justify-center mx-auto text-[#FF6D1F]">
              <FolderTree className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#222222] dark:text-[#F5F5F7]">
                {searchQuery ? "No matching collections" : "No collections found"}
              </p>
              <p className="text-[11px] text-[#8C8C8C] dark:text-[#6E6E73] mt-0.5">
                {searchQuery
                  ? `No collections match "${searchQuery}"`
                  : "Create a root collection to build your API hierarchy."}
              </p>
            </div>
            {onCreateRootCollection && !searchQuery && (
              <button
                type="button"
                onClick={onCreateRootCollection}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#FF6D1F] text-white hover:bg-[#E85B0F] text-xs font-medium transition-colors cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Root Collection</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default CollectionTree;
