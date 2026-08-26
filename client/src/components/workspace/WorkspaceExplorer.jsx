import React, { useState } from "react";
import {
  Folder,
  FolderOpen,
  ChevronRight,
  ChevronDown,
  Plus,
  Search,
  MoreVertical,
  Layers,
  Send,
  Sliders,
  History,
  Settings,
  LayoutDashboard,
} from "lucide-react";

// Method color helpers
const getMethodBadgeClass = (method) => {
  switch (method?.toUpperCase()) {
    case "GET":
      return "text-[#059669] dark:text-[#00E599] bg-[#ECFDF5] dark:bg-[#062417] border-[#A7F3D0] dark:border-[#104D30]";
    case "POST":
      return "text-[#D97706] dark:text-[#FBBF24] bg-[#FFFBEB] dark:bg-[#271E0B] border-[#FDE68A] dark:border-[#533F17]";
    case "PUT":
    case "PATCH":
      return "text-[#2563EB] dark:text-[#60A5FA] bg-[#EFF6FF] dark:bg-[#0D1E3A] border-[#BFDBFE] dark:border-[#1E3A8A]";
    case "DELETE":
      return "text-[#DC2626] dark:text-[#F87171] bg-[#FEE2E2] dark:bg-[#2A1517] border-[#FCA5A5] dark:border-[#481E24]";
    default:
      return "text-[#6B7280] dark:text-[#9CA3AF] bg-[#F3F4F6] dark:bg-[#1C1C1F] border-[#E5E7EB] dark:border-[#2C2C2E]";
  }
};

function WorkspaceExplorer({
  project,
  collections = [],
  loading = false,
  activeView,
  onSelectView,
  selectedRequest,
  onSelectRequest,
  onNewRequest,
  onNewCollection,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFolders, setExpandedFolders] = useState({
    default: true,
  });

  const toggleFolder = (id) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Mock request endpoints for scaffolding/previewing collections
  const sampleRequests = [
    { id: "req-1", name: "User Login", method: "POST", path: "/auth/login" },
    { id: "req-2", name: "Get Profile", method: "GET", path: "/users/me" },
    { id: "req-3", name: "Update Settings", method: "PATCH", path: "/users/settings" },
    { id: "req-4", name: "Delete Account", method: "DELETE", path: "/users" },
  ];

  const filteredCollections = collections.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside className="w-full md:w-64 lg:w-72 border-r border-[#E6D2A5] dark:border-[#1F1F23] bg-[#FAF3E1]/70 dark:bg-[#101012]/80 flex flex-col h-[calc(100vh-3.5rem)] shrink-0 select-none transition-colors duration-200">
      {/* 1. Project Title & New Action Header */}
      <div className="p-3 border-b border-[#E6D2A5] dark:border-[#1F1F23]">
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-5 h-5 rounded bg-[#FAF3E1] dark:bg-[#1C1C1F] border border-[#E6D2A5] dark:border-[#2C2C2E] flex items-center justify-center text-[#FF6D1F]">
              <Layers className="w-3 h-3" />
            </div>
            <span className="text-xs font-bold text-[#222222] dark:text-[#F5F5F7] truncate">
              {project?.name || "Workspace"}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onNewRequest}
              className="p-1 rounded hover:bg-[#F5E7C6] dark:hover:bg-[#1C1C1F] text-[#5C5C5C] dark:text-[#A1A1A6] hover:text-[#FF6D1F] transition-colors cursor-pointer"
              title="New Request"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={onNewCollection}
              className="p-1 rounded hover:bg-[#F5E7C6] dark:hover:bg-[#1C1C1F] text-[#5C5C5C] dark:text-[#A1A1A6] hover:text-[#FF6D1F] transition-colors cursor-pointer"
              title="New Collection"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8C8C8C] dark:text-[#6E6E73]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search collections & endpoints..."
            className="w-full pl-8 pr-2.5 py-1.5 rounded-md bg-[#FFFFFF] dark:bg-[#141416] border border-[#E6D2A5] dark:border-[#2C2C2E] text-[11px] text-[#222222] dark:text-[#F5F5F7] placeholder-[#8C8C8C] dark:placeholder-[#6E6E73] focus:outline-none focus:border-[#FF6D1F] transition-colors"
          />
        </div>
      </div>

      {/* 2. Collections & Requests Tree Area */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1 text-xs">
        <div className="flex items-center justify-between px-2 py-1 text-[10px] font-mono font-semibold uppercase tracking-wider text-[#8C8C8C] dark:text-[#6E6E73]">
          <span>COLLECTIONS</span>
          <span>{collections.length}</span>
        </div>

        {loading ? (
          <div className="space-y-1.5 p-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-6 rounded bg-[#E6D2A5]/30 dark:bg-[#1C1C1F] animate-pulse"
              />
            ))}
          </div>
        ) : filteredCollections.length > 0 ? (
          <div className="space-y-0.5">
            {filteredCollections.map((col, idx) => {
              const isExpanded = expandedFolders[col._id] ?? (idx === 0);
              return (
                <div key={col._id} className="space-y-0.5">
                  {/* Collection Folder Row */}
                  <div
                    onClick={() => toggleFolder(col._id)}
                    className="flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-[#F5E7C6]/60 dark:hover:bg-[#1C1C1F] text-[#222222] dark:text-[#F5F5F7] font-medium transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      {isExpanded ? (
                        <ChevronDown className="w-3.5 h-3.5 text-[#8C8C8C] dark:text-[#6E6E73] shrink-0" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 text-[#8C8C8C] dark:text-[#6E6E73] shrink-0" />
                      )}
                      {isExpanded ? (
                        <FolderOpen className="w-3.5 h-3.5 text-[#FF6D1F] shrink-0" />
                      ) : (
                        <Folder className="w-3.5 h-3.5 text-[#FF6D1F] shrink-0" />
                      )}
                      <span className="truncate text-xs font-semibold">{col.name}</span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onNewRequest();
                      }}
                      className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-[#FF6D1F] text-[#8C8C8C] dark:text-[#6E6E73] transition-all"
                      title="Add Request inside Collection"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Nested Endpoints under Collection */}
                  {isExpanded && (
                    <div className="pl-6 pr-1 space-y-0.5 border-l border-[#E6D2A5]/50 dark:border-[#2C2C2E] ml-3.5">
                      {sampleRequests.map((req) => {
                        const isSelected = selectedRequest?.id === req.id;
                        return (
                          <div
                            key={req.id}
                            onClick={() => onSelectRequest(req)}
                            className={`flex items-center justify-between px-2 py-1 rounded-md text-[11px] font-mono transition-colors cursor-pointer ${
                              isSelected
                                ? "bg-[#FF6D1F]/15 dark:bg-[#FF6D1F]/20 text-[#FF6D1F] dark:text-[#FF8D4D] font-semibold"
                                : "text-[#5C5C5C] dark:text-[#A1A1A6] hover:bg-[#F5E7C6]/40 dark:hover:bg-[#1C1C1F] hover:text-[#222222] dark:hover:text-[#F5F5F7]"
                            }`}
                          >
                            <div className="flex items-center gap-1.5 min-w-0">
                              <span
                                className={`text-[9px] px-1 py-0.2 rounded font-bold border ${getMethodBadgeClass(
                                  req.method
                                )}`}
                              >
                                {req.method}
                              </span>
                              <span className="truncate">{req.name}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-4 text-center space-y-2 border border-dashed border-[#E6D2A5] dark:border-[#2C2C2E] rounded-md m-1">
            <p className="text-[11px] text-[#5C5C5C] dark:text-[#A1A1A6]">
              No collections found
            </p>
            <button
              type="button"
              onClick={onNewCollection}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#FF6D1F] text-white text-[11px] font-medium hover:bg-[#E85B0F] transition-colors cursor-pointer"
            >
              <Plus className="w-3 h-3" />
              <span>Create Collection</span>
            </button>
          </div>
        )}
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
