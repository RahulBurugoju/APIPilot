import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Layers,
  Send,
  Plus,
  Sliders,
  History,
  LayoutDashboard,
  FolderTree,
  Trash2,
  Zap,
  Clock,
  ArrowUpRight,
  Search,
  CheckCircle2,
  AlertCircle,
  FileCode,
} from "lucide-react";
import CollectionTree from "../collections/CollectionTree";
import CreateEnvironmentModal from "../environments/CreateEnvironmentModal";
import environmentThunks from "../../features/environment/environment.thunk.js";

const METHOD_COLORS = {
  GET: "text-[#059669] dark:text-[#00E599] bg-[#ECFDF5] dark:bg-[#062417] border-[#A7F3D0] dark:border-[#104D30]",
  POST: "text-[#D97706] dark:text-[#FBBF24] bg-[#FFFBEB] dark:bg-[#201806] border-[#FDE68A] dark:border-[#523B0F]",
  PUT: "text-[#2563EB] dark:text-[#60A5FA] bg-[#EFF6FF] dark:bg-[#0A1B36] border-[#BFDBFE] dark:border-[#1E3A8A]",
  PATCH: "text-[#7C3AED] dark:text-[#A78BFA] bg-[#F5F3FF] dark:bg-[#1E1035] border-[#DDD6FE] dark:border-[#3B1D70]",
  DELETE: "text-[#DC2626] dark:text-[#F87171] bg-[#FEF2F2] dark:bg-[#200B0D] border-[#FECACA] dark:border-[#4B141A]",
};

function formatRelativeTime(isoDateStr) {
  if (!isoDateStr) return "";
  try {
    const date = new Date(isoDateStr);
    const now = new Date();
    const diffSec = Math.floor((now - date) / 1000);
    if (diffSec < 10) return "just now";
    if (diffSec < 60) return `${diffSec}s ago`;
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) return `${diffHour}h ago`;
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

function WorkspaceExplorer({
  project,
  collections = [],
  requests = [],
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
  sidebarTab: controlledTab,
  onSelectSidebarTab,
  selectedEnvironment,
  onSelectEnvironment,
}) {
  const dispatch = useDispatch();
  const projectId = project?._id;

  // Sidebar Tab: 'collections' | 'environments' | 'history'
  const [internalTab, setInternalTab] = useState("collections");
  const activeTab = controlledTab !== undefined ? controlledTab : internalTab;

  const handleTabChange = (tab) => {
    if (onSelectSidebarTab) {
      onSelectSidebarTab(tab);
    }
    setInternalTab(tab);
  };

  // Redux Environments
  const environments = useSelector(
    (state) =>
      state.environment?.environments ||
      state.environments?.environments ||
      []
  );

  // History from localStorage
  const [historyList, setHistoryList] = useState([]);
  const [historySearch, setHistorySearch] = useState("");
  const [isCreateEnvOpen, setIsCreateEnvOpen] = useState(false);

  useEffect(() => {
    if (!projectId) return;
    try {
      const saved = localStorage.getItem(`apipilot_history_${projectId}`);
      if (saved) {
        setHistoryList(JSON.parse(saved));
      } else {
        setHistoryList([]);
      }
    } catch {
      setHistoryList([]);
    }
  }, [projectId, activeTab]);

  const handleClearHistory = () => {
    if (!projectId) return;
    localStorage.removeItem(`apipilot_history_${projectId}`);
    setHistoryList([]);
  };

  const handleActivateEnv = (e, envId) => {
    e.stopPropagation();
    if (!projectId || !envId) return;
    dispatch(
      environmentThunks.activateEnvironment({
        projectId,
        environmentId: envId,
      })
    );
  };

  const handleDeleteEnv = (e, envId) => {
    e.stopPropagation();
    if (!projectId || !envId) return;
    dispatch(
      environmentThunks.deleteEnvironment({
        projectId,
        environmentId: envId,
      })
    );
  };

  const handleSelectHistoryItem = (item) => {
    if (!onSelectRequest) return;
    const matched = requests.find((r) => String(r._id) === String(item.requestId));
    if (matched) {
      onSelectRequest(matched);
    } else {
      onSelectRequest({
        _id: item.requestId || "history_temp",
        name: item.name || "Executed Request",
        method: item.method || "GET",
        url: item.url || "",
      });
    }
    if (onSelectView) {
      onSelectView("request");
    }
  };

  const filteredHistory = historyList.filter((item) => {
    if (!historySearch.trim()) return true;
    const q = historySearch.toLowerCase();
    return (
      item.url?.toLowerCase().includes(q) ||
      item.name?.toLowerCase().includes(q) ||
      item.method?.toLowerCase().includes(q)
    );
  });

  return (
    <aside className="w-full md:w-64 lg:w-72 border-r border-[#E6D2A5] dark:border-[#1F1F23] bg-[#FAF3E1]/70 dark:bg-[#101012]/80 flex flex-col h-[calc(100vh-3.5rem)] shrink-0 select-none transition-colors duration-200">
      {/* 1. Project Title & Quick Actions */}
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
                onClick={() => onNewRequest(selectedCollection)}
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

      {/* 2. Three-Way Navigation Tabs: Collections | Environments | History */}
      <div className="flex items-center border-b border-[#E6D2A5] dark:border-[#1F1F23] p-1.5 gap-1 bg-[#FAF3E1]/40 dark:bg-[#141416]/40 text-xs font-medium">
        <button
          type="button"
          onClick={() => handleTabChange("collections")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md transition-all cursor-pointer ${
            activeTab === "collections"
              ? "bg-[#FFFFFF] dark:bg-[#1C1C1F] text-[#FF6D1F] font-semibold shadow-2xs border border-[#E6D2A5] dark:border-[#2C2C2E]"
              : "text-[#5C5C5C] dark:text-[#A1A1A6] hover:text-[#222222] dark:hover:text-[#F5F5F7]"
          }`}
          title="Collections"
        >
          <FolderTree className="w-3.5 h-3.5" />
          <span>Collections</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange("environments")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md transition-all cursor-pointer ${
            activeTab === "environments"
              ? "bg-[#FFFFFF] dark:bg-[#1C1C1F] text-[#FF6D1F] font-semibold shadow-2xs border border-[#E6D2A5] dark:border-[#2C2C2E]"
              : "text-[#5C5C5C] dark:text-[#A1A1A6] hover:text-[#222222] dark:hover:text-[#F5F5F7]"
          }`}
          title="Environments"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Envs</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange("history")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md transition-all cursor-pointer ${
            activeTab === "history"
              ? "bg-[#FFFFFF] dark:bg-[#1C1C1F] text-[#FF6D1F] font-semibold shadow-2xs border border-[#E6D2A5] dark:border-[#2C2C2E]"
              : "text-[#5C5C5C] dark:text-[#A1A1A6] hover:text-[#222222] dark:hover:text-[#F5F5F7]"
          }`}
          title="History"
        >
          <History className="w-3.5 h-3.5" />
          <span>History</span>
        </button>
      </div>

      {/* 3. Tab Body */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* TAB 1: COLLECTIONS */}
        {activeTab === "collections" && (
          <div className="flex-1 overflow-hidden p-2">
            <CollectionTree
              collections={collections}
              requests={requests}
              loading={loading}
              selectedCollectionId={selectedCollection?._id}
              selectedRequestId={selectedRequest?._id}
              onSelectCollection={onSelectCollection}
              onSelectRequest={onSelectRequest}
              onCreateRootCollection={onNewCollection}
              onCreateSubCollection={onCreateSubCollection}
              onEditCollection={onEditCollection}
              onDeleteCollection={onDeleteCollection}
              onAddRequest={onNewRequest}
            />
          </div>
        )}

        {/* TAB 2: ENVIRONMENTS */}
        {activeTab === "environments" && (
          <div className="flex-1 overflow-y-auto p-2.5 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between px-1 pb-1 text-[11px] font-bold text-[#8C8C8C] dark:text-[#6E6E73] uppercase tracking-wider">
                <span>Environments</span>
                <button
                  type="button"
                  onClick={() => setIsCreateEnvOpen(true)}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#FF6D1F] hover:text-[#E85B0F] cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>New</span>
                </button>
              </div>

              {environments.length === 0 ? (
                <div className="text-center py-8 px-2 space-y-2 text-[#8C8C8C] dark:text-[#6E6E73]">
                  <Sliders className="w-6 h-6 mx-auto opacity-50 text-[#FF6D1F]" />
                  <p className="text-xs font-semibold text-[#222222] dark:text-[#F5F5F7]">
                    No Environments
                  </p>
                  <p className="text-[11px] leading-relaxed">
                    Create Development, Staging, or Production sets.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsCreateEnvOpen(true)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#FF6D1F] hover:bg-[#E85B0F] text-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Create Environment</span>
                  </button>
                </div>
              ) : (
                environments.map((env) => {
                  const isActive = Boolean(env.isActive);
                  const isSelected = selectedEnvironment?._id === env._id;
                  const varCount = env.variables?.length || 0;

                  return (
                    <div
                      key={env._id}
                      onClick={() => {
                        if (onSelectEnvironment) {
                          onSelectEnvironment(env);
                        }
                      }}
                      className={`group flex items-center justify-between p-2.5 rounded-lg border transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[#FAF3E1] dark:bg-[#1C1C1F] border-[#FF6D1F]"
                          : "bg-transparent border-transparent hover:bg-[#FAF3E1]/60 dark:hover:bg-[#1C1C1F]/60"
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        {/* Active toggle button */}
                        <button
                          type="button"
                          onClick={(e) => handleActivateEnv(e, env._id)}
                          className="cursor-pointer shrink-0 transition-transform active:scale-90"
                          title={
                            isActive
                              ? "Active environment"
                              : "Click to set as active"
                          }
                        >
                          {isActive ? (
                            <div className="w-3.5 h-3.5 rounded-full bg-[#ECFDF5] dark:bg-[#062417] border border-[#059669] dark:border-[#00E599] flex items-center justify-center">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#059669] dark:bg-[#00E599]" />
                            </div>
                          ) : (
                            <div className="w-3.5 h-3.5 rounded-full border border-[#8C8C8C] dark:border-[#6E6E73] hover:border-[#FF6D1F]" />
                          )}
                        </button>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`text-xs font-semibold truncate ${
                                isSelected
                                  ? "text-[#FF6D1F]"
                                  : "text-[#222222] dark:text-[#F5F5F7]"
                              }`}
                            >
                              {env.name}
                            </span>
                            {isActive && (
                              <span className="text-[9px] font-bold text-[#059669] dark:text-[#00E599]">
                                ● Active
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-[#8C8C8C] dark:text-[#6E6E73]">
                            {varCount} {varCount === 1 ? "var" : "vars"}
                          </span>
                        </div>
                      </div>

                      {/* Quick delete button */}
                      <button
                        type="button"
                        onClick={(e) => handleDeleteEnv(e, env._id)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-[#8C8C8C] hover:text-[#DC2626] transition-opacity cursor-pointer"
                        title="Delete environment"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {/* Bottom button */}
            <div className="pt-3 border-t border-[#E6D2A5] dark:border-[#1F1F23]">
              <button
                type="button"
                onClick={() => setIsCreateEnvOpen(true)}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg border border-dashed border-[#E6D2A5] dark:border-[#2C2C2E] hover:border-[#FF6D1F] text-xs font-semibold text-[#5C5C5C] dark:text-[#A1A1A6] hover:text-[#FF6D1F] transition-all cursor-pointer select-none"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ New Environment</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: HISTORY */}
        {activeTab === "history" && (
          <div className="flex-1 overflow-y-auto p-2.5 flex flex-col">
            <div className="flex items-center justify-between px-1 pb-2">
              <span className="text-[11px] font-bold text-[#8C8C8C] dark:text-[#6E6E73] uppercase tracking-wider">
                Recent History
              </span>
              {historyList.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearHistory}
                  className="text-[10px] text-[#DC2626] dark:text-[#F87171] hover:underline cursor-pointer"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Search filter in history */}
            {historyList.length > 0 && (
              <div className="relative mb-2">
                <Search className="w-3 h-3 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8C8C8C]" />
                <input
                  type="text"
                  value={historySearch}
                  onChange={(e) => setHistorySearch(e.target.value)}
                  placeholder="Filter history..."
                  className="w-full pl-7 pr-2.5 py-1 rounded-md bg-[#FFFFFF] dark:bg-[#1C1C1F] border border-[#E6D2A5] dark:border-[#2C2C2E] text-[11px] text-[#222222] dark:text-[#F5F5F7] placeholder-[#8C8C8C] focus:outline-none focus:border-[#FF6D1F]"
                />
              </div>
            )}

            {historyList.length === 0 ? (
              <div className="text-center py-10 px-2 space-y-2 text-[#8C8C8C]">
                <History className="w-6 h-6 mx-auto opacity-40 text-[#FF6D1F]" />
                <p className="text-xs font-semibold text-[#222222] dark:text-[#F5F5F7]">
                  No History Yet
                </p>
                <p className="text-[11px]">
                  Send requests in Request Center to view executed endpoints here.
                </p>
              </div>
            ) : filteredHistory.length === 0 ? (
              <div className="py-6 text-center text-xs text-[#8C8C8C]">
                No matching history.
              </div>
            ) : (
              <div className="space-y-1 overflow-y-auto flex-1">
                {filteredHistory.map((item) => {
                  const methodColor =
                    METHOD_COLORS[item.method] ||
                    "text-[#FF6D1F] bg-[#FAF3E1] dark:bg-[#1C1C1F]";

                  return (
                    <div
                      key={item.id}
                      onClick={() => handleSelectHistoryItem(item)}
                      className="group p-2 rounded-lg border border-transparent hover:border-[#E6D2A5] dark:hover:border-[#2C2C2E] hover:bg-[#FAF3E1]/60 dark:hover:bg-[#1C1C1F]/60 transition-all cursor-pointer space-y-1"
                    >
                      <div className="flex items-center justify-between gap-1.5">
                        <div className="flex items-center gap-1.5 min-w-0 flex-1">
                          <span
                            className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold border shrink-0 ${methodColor}`}
                          >
                            {item.method}
                          </span>
                          <span className="text-xs font-mono font-medium text-[#222222] dark:text-[#F5F5F7] truncate">
                            {item.url || item.name}
                          </span>
                        </div>

                        {item.status ? (
                          <span
                            className={`text-[10px] font-mono font-semibold px-1 rounded ${
                              item.status >= 200 && item.status < 300
                                ? "text-[#059669] dark:text-[#00E599]"
                                : "text-[#DC2626] dark:text-[#F87171]"
                            }`}
                          >
                            {item.status}
                          </span>
                        ) : null}
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-[#8C8C8C] dark:text-[#6E6E73] font-mono px-0.5">
                        <span>{item.time ? `${item.time}ms` : ""}</span>
                        <span>{formatRelativeTime(item.timestamp)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>



      {/* Create Environment Modal */}
      <CreateEnvironmentModal
        isOpen={isCreateEnvOpen}
        onClose={() => setIsCreateEnvOpen(false)}
        projectId={projectId}
        onSuccess={(newEnv) => {
          if (onSelectEnvironment && newEnv) {
            onSelectEnvironment(newEnv);
          }
        }}
      />
    </aside>
  );
}

export default WorkspaceExplorer;
