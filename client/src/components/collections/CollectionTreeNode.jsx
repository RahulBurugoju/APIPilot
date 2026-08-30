import React, { useState } from "react";
import {
  Folder,
  FolderOpen,
  ChevronRight,
  ChevronDown,
  Edit2,
  Trash2,
  FolderPlus,
  FilePlus,
  MoreVertical,
} from "lucide-react";
import ContextMenu from "../common/ContextMenu";

/**
 * Single Tree Item Component (Recursive)
 */
export function CollectionTreeNode({
  node,
  level = 0,
  requests = [],
  selectedCollectionId,
  selectedRequestId,
  onSelectCollection,
  onSelectRequest,
  onCreateSubCollection,
  onEditCollection,
  onDeleteCollection,
  onAddRequest,
  onEditRequest,
  onDeleteRequest,
  expandedNodes,
  toggleExpand,
}) {
  const [contextMenu, setContextMenu] = useState({
    isOpen: false,
    position: { x: 0, y: 0 },
    type: null, // "collection" | "request"
    targetItem: null,
  });

  const isExpanded = expandedNodes[node._id] ?? false;
  const isSelected = selectedCollectionId && String(selectedCollectionId) === String(node._id);

  const nodeRequests = Array.isArray(requests)
    ? requests.filter(
        (req) => req.collection && String(req.collection) === String(node._id)
      )
    : [];
  const hasSubCollections = node.children && node.children.length > 0;
  const hasRequests = nodeRequests.length > 0;
  const canExpand = hasSubCollections || hasRequests;

  const handleCollectionContextMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onSelectCollection) onSelectCollection(node);
    setContextMenu({
      isOpen: true,
      position: { x: e.clientX, y: e.clientY },
      type: "collection",
      targetItem: node,
    });
  };

  const handleRequestContextMenu = (e, req) => {
    e.preventDefault();
    e.stopPropagation();
    if (onSelectRequest) onSelectRequest(req, node);
    setContextMenu({
      isOpen: true,
      position: { x: e.clientX, y: e.clientY },
      type: "request",
      targetItem: req,
    });
  };

  const closeContextMenu = () => {
    setContextMenu((prev) => ({ ...prev, isOpen: false }));
  };

  // Menu items for Collection
  const collectionMenuItems = [
    {
      label: "Add Request",
      icon: FilePlus,
      onClick: () => {
        if (onAddRequest) onAddRequest(node);
      },
    },
    {
      label: "Add Sub-Collection",
      icon: FolderPlus,
      onClick: () => {
        if (onCreateSubCollection) onCreateSubCollection(node);
      },
    },
    { divider: true },
    {
      label: "Rename / Edit",
      icon: Edit2,
      shortcut: "Ctrl+E",
      onClick: () => {
        if (onEditCollection) onEditCollection(node);
      },
    },
    {
      label: "Delete Collection",
      icon: Trash2,
      danger: true,
      shortcut: "Del",
      onClick: () => {
        if (onDeleteCollection) onDeleteCollection(node);
      },
    },
  ];

  // Menu items for Request
  const requestMenuItems = [
    {
      label: "Rename / Edit",
      icon: Edit2,
      shortcut: "Ctrl+E",
      onClick: () => {
        if (onEditRequest && contextMenu.targetItem) {
          onEditRequest(contextMenu.targetItem, node);
        }
      },
    },
    {
      label: "Delete Request",
      icon: Trash2,
      danger: true,
      shortcut: "Del",
      onClick: () => {
        if (onDeleteRequest && contextMenu.targetItem) {
          onDeleteRequest(contextMenu.targetItem, node);
        }
      },
    },
  ];

  return (
    <div className="select-none space-y-0.5">
      {/* Context Menu Popover */}
      <ContextMenu
        isOpen={contextMenu.isOpen}
        onClose={closeContextMenu}
        position={contextMenu.position}
        items={contextMenu.type === "collection" ? collectionMenuItems : requestMenuItems}
      />

      {/* Collection Node Row */}
      <div
        onClick={() => {
          if (onSelectCollection) onSelectCollection(node);
        }}
        onContextMenu={handleCollectionContextMenu}
        style={{ paddingLeft: `${Math.max(level * 12 + 8, 8)}px` }}
        className={`group relative flex items-center justify-between py-1.5 pr-2 rounded-md text-xs font-medium transition-all duration-150 cursor-pointer ${
          isSelected
            ? "bg-[#FF6D1F]/15 dark:bg-[#FF6D1F]/20 text-[#FF6D1F] dark:text-[#FF8D4D] font-semibold border-l-2 border-[#FF6D1F]"
            : "text-[#222222] dark:text-[#F5F5F7] hover:bg-[#F5E7C6]/60 dark:hover:bg-[#1C1C1F]"
        }`}
      >
        {/* Left Side: Expand Chevron + Folder Icon + Title */}
        <div className="flex items-center gap-1.5 min-w-0 flex-1">
          {/* Chevron expand/collapse toggle */}
          {canExpand ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleExpand(node._id);
              }}
              className="p-0.5 rounded hover:bg-[#E6D2A5]/50 dark:hover:bg-[#2C2C2E] text-[#8C8C8C] dark:text-[#6E6E73] transition-colors"
            >
              {isExpanded ? (
                <ChevronDown className="w-3.5 h-3.5" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5" />
              )}
            </button>
          ) : (
            <span className="w-4 shrink-0" />
          )}

          {/* Folder Icon */}
          <div
            onClick={(e) => {
              e.stopPropagation();
              toggleExpand(node._id);
            }}
            className="shrink-0 text-[#FF6D1F]"
          >
            {isExpanded ? (
              <FolderOpen className="w-4 h-4" />
            ) : (
              <Folder className="w-4 h-4" />
            )}
          </div>

          {/* Collection Name */}
          <span className="truncate text-xs font-medium" title={node.name}>
            {node.name}
          </span>

          {/* Total Child Items Badge if any */}
          {canExpand && (
            <span className="px-1.5 py-0.2 text-[10px] font-mono rounded-full bg-[#FAF3E1] dark:bg-[#1C1C1F] text-[#8C8C8C] dark:text-[#6E6E73] border border-[#E6D2A5] dark:border-[#2C2C2E]">
              {(node.children?.length || 0) + nodeRequests.length}
            </span>
          )}
        </div>

        {/* Right Side: Hover Quick Actions + 3 Dots Menu Button */}
        <div className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5 transition-opacity shrink-0">
          {onAddRequest && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onAddRequest(node);
              }}
              className="p-1 rounded hover:bg-[#FF6D1F]/20 text-[#5C5C5C] dark:text-[#A1A1A6] hover:text-[#FF6D1F] transition-colors"
              title="Add Request"
            >
              <FilePlus className="w-3 h-3" />
            </button>
          )}

          {onCreateSubCollection && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onCreateSubCollection(node);
              }}
              className="p-1 rounded hover:bg-[#FF6D1F]/20 text-[#5C5C5C] dark:text-[#A1A1A6] hover:text-[#FF6D1F] transition-colors"
              title="Add Sub-collection"
            >
              <FolderPlus className="w-3 h-3" />
            </button>
          )}

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              const rect = e.currentTarget.getBoundingClientRect();
              setContextMenu({
                isOpen: true,
                position: { x: rect.left, y: rect.bottom + 4 },
                type: "collection",
                targetItem: node,
              });
            }}
            className="p-1 rounded hover:bg-[#E6D2A5]/60 dark:hover:bg-[#2C2C2E] text-[#5C5C5C] dark:text-[#A1A1A6] hover:text-[#222222] dark:hover:text-[#F5F5F7] transition-colors"
            title="Collection Options"
          >
            <MoreVertical className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Recursive Children Render (Sub-collections & Requests) */}
      {isExpanded && (
        <div className="border-l border-[#E6D2A5]/40 dark:border-[#2C2C2E] ml-4 space-y-0.5">
          {/* 1. Sub-collections */}
          {hasSubCollections &&
            node.children.map((child) => (
              <CollectionTreeNode
                key={child._id}
                node={child}
                level={level + 1}
                requests={requests}
                selectedCollectionId={selectedCollectionId}
                selectedRequestId={selectedRequestId}
                onSelectCollection={onSelectCollection}
                onSelectRequest={onSelectRequest}
                onCreateSubCollection={onCreateSubCollection}
                onEditCollection={onEditCollection}
                onDeleteCollection={onDeleteCollection}
                onAddRequest={onAddRequest}
                onEditRequest={onEditRequest}
                onDeleteRequest={onDeleteRequest}
                expandedNodes={expandedNodes}
                toggleExpand={toggleExpand}
              />
            ))}

          {/* 2. Collection Requests */}
          {nodeRequests.map((req) => {
            const isReqSelected =
              selectedRequestId && String(selectedRequestId) === String(req._id);

            const methodColors = {
              GET: "text-[#059669] bg-[#ECFDF5] dark:bg-[#062417] dark:text-[#00E599]",
              POST: "text-[#D97706] bg-[#FEF3C7] dark:bg-[#271E05] dark:text-[#FBBF24]",
              PUT: "text-[#2563EB] bg-[#EFF6FF] dark:bg-[#0A192F] dark:text-[#60A5FA]",
              PATCH: "text-[#7C3AED] bg-[#F5F3FF] dark:bg-[#1E1035] dark:text-[#A78BFA]",
              DELETE: "text-[#DC2626] bg-[#FEE2E2] dark:bg-[#2A1517] dark:text-[#F87171]",
              HEAD: "text-[#4B5563] bg-[#F3F4F6] dark:bg-[#1F2937] dark:text-[#9CA3AF]",
              OPTIONS: "text-[#4B5563] bg-[#F3F4F6] dark:bg-[#1F2937] dark:text-[#9CA3AF]",
            };

            return (
              <div
                key={req._id}
                onClick={(e) => {
                  e.stopPropagation();
                  if (onSelectRequest) onSelectRequest(req, node);
                }}
                onContextMenu={(e) => handleRequestContextMenu(e, req)}
                style={{ paddingLeft: `${Math.max((level + 1) * 8 + 8, 12)}px` }}
                className={`group flex items-center justify-between py-1 pr-2 rounded-md text-xs transition-all cursor-pointer ${
                  isReqSelected
                    ? "bg-[#FF6D1F]/15 dark:bg-[#FF6D1F]/20 text-[#FF6D1F] font-semibold border-l-2 border-[#FF6D1F]"
                    : "text-[#222222] dark:text-[#F5F5F7] hover:bg-[#F5E7C6]/50 dark:hover:bg-[#1C1C1F]"
                }`}
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <span
                    className={`px-1.5 py-0.2 text-[9px] font-mono font-bold rounded shrink-0 ${
                      methodColors[req.method] || methodColors.GET
                    }`}
                  >
                    {req.method || "GET"}
                  </span>
                  <span className="truncate text-[11px] font-medium" title={req.name}>
                    {req.name}
                  </span>
                </div>

                {/* Right side: 3 Dots Menu Button for Request */}
                <div className="opacity-0 group-hover:opacity-100 flex items-center transition-opacity shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      const rect = e.currentTarget.getBoundingClientRect();
                      setContextMenu({
                        isOpen: true,
                        position: { x: rect.left, y: rect.bottom + 4 },
                        type: "request",
                        targetItem: req,
                      });
                    }}
                    className="p-1 rounded hover:bg-[#E6D2A5]/60 dark:hover:bg-[#2C2C2E] text-[#5C5C5C] dark:text-[#A1A1A6] hover:text-[#222222] dark:hover:text-[#F5F5F7] transition-colors"
                    title="Request Options"
                  >
                    <MoreVertical className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default CollectionTreeNode;
