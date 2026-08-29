import React from "react";
import {
  Folder,
  FolderOpen,
  ChevronRight,
  ChevronDown,
  Edit2,
  Trash2,
  FolderPlus,
  FilePlus,
} from "lucide-react";

/**
 * Single Tree Item Component (Recursive)
 */
export function CollectionTreeNode({
  node,
  level = 0,
  selectedCollectionId,
  onSelectCollection,
  onCreateSubCollection,
  onEditCollection,
  onDeleteCollection,
  onAddRequest,
  expandedNodes,
  toggleExpand,
}) {
  const isExpanded = expandedNodes[node._id] ?? false;
  const isSelected = selectedCollectionId && String(selectedCollectionId) === String(node._id);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="select-none space-y-0.5">
      {/* Node Row */}
      <div
        onClick={() => {
          if (onSelectCollection) onSelectCollection(node);
        }}
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
          {hasChildren ? (
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
              if (hasChildren) {
                e.stopPropagation();
                toggleExpand(node._id);
              }
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

          {/* Child Count Badge if any */}
          {hasChildren && (
            <span className="px-1.5 py-0.2 text-[10px] font-mono rounded-full bg-[#FAF3E1] dark:bg-[#1C1C1F] text-[#8C8C8C] dark:text-[#6E6E73] border border-[#E6D2A5] dark:border-[#2C2C2E]">
              {node.children.length}
            </span>
          )}
        </div>

        {/* Right Side: Hover Quick Actions */}
        <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity shrink-0">
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

          {onEditCollection && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEditCollection(node);
              }}
              className="p-1 rounded hover:bg-[#F5E7C6] dark:hover:bg-[#2C2C2E] text-[#5C5C5C] dark:text-[#A1A1A6] hover:text-[#222222] dark:hover:text-[#F5F5F7] transition-colors"
              title="Edit Collection"
            >
              <Edit2 className="w-3 h-3" />
            </button>
          )}

          {onDeleteCollection && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteCollection(node);
              }}
              className="p-1 rounded hover:bg-red-500/20 text-[#5C5C5C] dark:text-[#A1A1A6] hover:text-red-500 transition-colors"
              title="Delete Collection"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Recursive Children Render */}
      {isExpanded && hasChildren && (
        <div className="border-l border-[#E6D2A5]/40 dark:border-[#2C2C2E] ml-4">
          {node.children.map((child) => (
            <CollectionTreeNode
              key={child._id}
              node={child}
              level={level + 1}
              selectedCollectionId={selectedCollectionId}
              onSelectCollection={onSelectCollection}
              onCreateSubCollection={onCreateSubCollection}
              onEditCollection={onEditCollection}
              onDeleteCollection={onDeleteCollection}
              onAddRequest={onAddRequest}
              expandedNodes={expandedNodes}
              toggleExpand={toggleExpand}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default CollectionTreeNode;
