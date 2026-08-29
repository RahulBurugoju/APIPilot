import React from "react";
import {
  Layers,
  Send,
  Plus,
  Sliders,
  History,
  LayoutDashboard,
} from "lucide-react";
import CollectionTree from "../collections/CollectionTree";

function WorkspaceExplorer({
  project,
  collections = [],
  loading = false,
  activeView,
  onSelectView,
  selectedCollection,
  onSelectCollection,
  selectedRequest,
  onSelectRequest,
  onNewRequest,
  onNewCollection,
  onCreateSubCollection,
  onEditCollection,
  onDeleteCollection,
}) {
  return (
    <aside className="w-full md:w-64 lg:w-72 border-r border-[#E6D2A5] dark:border-[#1F1F23] bg-[#FAF3E1]/70 dark:bg-[#101012]/80 flex flex-col h-[calc(100vh-3.5rem)] shrink-0 select-none transition-colors duration-200">
      {/* 1. Project Title & Action Header */}
      <div className="p-3 border-b border-[#E6D2A5] dark:border-[#1F1F23]">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-5 h-5 rounded bg-[#FAF3E1] dark:bg-[#1C1C1F] border border-[#E6D2A5] dark:border-[#2C2C2E] flex items-center justify-center text-[#FF6D1F]">
              <Layers className="w-3 h-3" />
            </div>
            <span className="text-xs font-bold text-[#222222] dark:text-[#F5F5F7] truncate">
              {project?.name || "Workspace"}
            </span>
          </div>

          <div className="flex items-center gap-1">
            {onNewRequest && (
              <button
                type="button"
                onClick={onNewRequest}
                className="p-1 rounded hover:bg-[#F5E7C6] dark:hover:bg-[#1C1C1F] text-[#5C5C5C] dark:text-[#A1A1A6] hover:text-[#FF6D1F] transition-colors cursor-pointer"
                title="New Request"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            )}
            {onNewCollection && (
              <button
                type="button"
                onClick={onNewCollection}
                className="p-1 rounded hover:bg-[#F5E7C6] dark:hover:bg-[#1C1C1F] text-[#5C5C5C] dark:text-[#A1A1A6] hover:text-[#FF6D1F] transition-colors cursor-pointer"
                title="New Root Collection"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Interactive Collection Tree View */}
      <div className="flex-1 overflow-hidden p-2">
        <CollectionTree
          collections={collections}
          loading={loading}
          selectedCollectionId={selectedCollection?._id}
          onSelectCollection={onSelectCollection}
          onCreateRootCollection={onNewCollection}
          onCreateSubCollection={onCreateSubCollection}
          onEditCollection={onEditCollection}
          onDeleteCollection={onDeleteCollection}
          onAddRequest={onNewRequest}
        />
      </div>

      {/* 3. Bottom Utility Sidebar Tabs */}
      <div className="p-2 border-t border-[#E6D2A5] dark:border-[#1F1F23] bg-[#FAF3E1]/90 dark:bg-[#0B0B0D]/90 space-y-0.5">
        <button
          type="button"
          onClick={() => onSelectView("overview")}
          className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
            activeView === "overview"
              ? "bg-[#FF6D1F] text-white font-semibold"
              : "text-[#5C5C5C] dark:text-[#A1A1A6] hover:bg-[#F5E7C6] dark:hover:bg-[#1C1C1F] hover:text-[#222222] dark:hover:text-[#F5F5F7]"
          }`}
        >
          <LayoutDashboard className="w-3.5 h-3.5" />
          <span>Overview</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectView("environments")}
          className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
            activeView === "environments"
              ? "bg-[#FF6D1F] text-white font-semibold"
              : "text-[#5C5C5C] dark:text-[#A1A1A6] hover:bg-[#F5E7C6] dark:hover:bg-[#1C1C1F] hover:text-[#222222] dark:hover:text-[#F5F5F7]"
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Environments</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectView("history")}
          className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
            activeView === "history"
              ? "bg-[#FF6D1F] text-white font-semibold"
              : "text-[#5C5C5C] dark:text-[#A1A1A6] hover:bg-[#F5E7C6] dark:hover:bg-[#1C1C1F] hover:text-[#222222] dark:hover:text-[#F5F5F7]"
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>History</span>
        </button>
      </div>
    </aside>
  );
}

export default WorkspaceExplorer;
