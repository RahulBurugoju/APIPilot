import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link, useNavigate } from "react-router-dom";
import projectThunks from "../../features/project/project.thunk";
import collectionThunk from "../../features/collection/collection.thunk";
import ThemeToggle from "../../components/common/ThemeToggle";
import EditProjectModal from "../../components/projects/EditProjectModal";
import DeleteProjectModal from "../../components/projects/DeleteProjectModal";
import CreateCollectionModal from "../../components/collections/CreateCollectionModal";
import EditCollectionModal from "../../components/collections/EditCollectionModal";
import DeleteCollectionModal from "../../components/collections/DeleteCollectionModal";
import CreateRequestModal from "../../components/requests/CreateRequestModal";
import EditRequestModal from "../../components/requests/EditRequestModal";
import DeleteRequestModal from "../../components/requests/DeleteRequestModal";
import requestThunk from "../../features/request/request.Thunk.js";
import { setCurrentRequest, clearCurrentRequest } from "../../features/request/requestSlice.js";
import WorkspaceExplorer from "../../components/workspace/WorkspaceExplorer";
import RequestCenter from "../../components/workspace/RequestCenter";
import environmentThunks from "../../features/environment/environment.thunk.js";
import EnvironmentSelector from "../../components/environments/EnvironmentSelector";
import EnvironmentEditor from "../../components/environments/EnvironmentEditor";
import RequestHistoryViewer from "../../components/history/RequestHistoryViewer";
import { clearHistory } from "../../features/requestHistory/requestHistory.thunk.js";
import {
  Folder,
  Clock,
  Copy,
  Check,
  AlertCircle,
  Sliders,
  Layers,
  Edit2,
  Trash2,
  ChevronDown,
  LayoutDashboard,
  Terminal,
  LogOut,
  FolderTree,
  History,
  Settings,
  Plus,
  ArrowUpRight,
  Send,
} from "lucide-react";
import { logoutUser } from "../../features/auth/auth.thunk";

function ProjectWorkspacePage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { currentProject, loading, error } = useSelector(
    (state) => state.project
  );
  const {
    collections,
    loading: collectionsLoading,
    error: collectionsError,
  } = useSelector((state) => state.collection);
  const { requests, currentRequest } = useSelector((state) => state.request);

  const [copied, setCopied] = useState(false);
  const [activeView, setActiveView] = useState("request"); // 'request' | 'environment' | 'historyViewer'
  const [sidebarTab, setSidebarTab] = useState("collections"); // 'collections' | 'environments' | 'history'
  const [selectedEnvironment, setSelectedEnvironment] = useState(null);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [selectedExecutionHistory, setSelectedExecutionHistory] = useState(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleSelectRequest = (req) => {
    dispatch(setCurrentRequest(req));
    setActiveView("request");
  };

  const handleSelectHistoryExecution = (executionItem) => {
    setSelectedExecutionHistory(executionItem);
    setActiveView("historyViewer");
  };

  // Modal / Form Visibility States
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCreateCollectionModalOpen, setIsCreateCollectionModalOpen] = useState(false);
  const [parentCollectionForCreate, setParentCollectionForCreate] = useState(null);
  const [collectionToEdit, setCollectionToEdit] = useState(null);
  const [isEditCollectionModalOpen, setIsEditCollectionModalOpen] = useState(false);
  const [collectionToDelete, setCollectionToDelete] = useState(null);
  const [isDeleteCollectionModalOpen, setIsDeleteCollectionModalOpen] = useState(false);

  const [isCreateRequestModalOpen, setIsCreateRequestModalOpen] = useState(false);
  const [targetCollectionForRequest, setTargetCollectionForRequest] = useState(null);
  const [requestToEdit, setRequestToEdit] = useState(null);
  const [isEditRequestModalOpen, setIsEditRequestModalOpen] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState(null);
  const [isDeleteRequestModalOpen, setIsDeleteRequestModalOpen] = useState(false);

  useEffect(() => {
    if (projectId) {
      dispatch(projectThunks.getProject({ projectId }));
      dispatch(collectionThunk.getProjectCollections({ projectId }));
      dispatch(environmentThunks.getProjectEnvironments({ projectId }));
    }
  }, [projectId, dispatch]);

  useEffect(() => {
    if (projectId && collections && collections.length > 0) {
      collections.forEach((col) => {
        dispatch(
          requestThunk.getCollectionRequests({
            projectId,
            collectionId: col._id,
          })
        );
      });
    }
  }, [projectId, collections, dispatch]);

  const handleCopyId = () => {
    if (currentProject?._id) {
      navigator.clipboard.writeText(currentProject._id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  // Loading State
  if (loading && !currentProject) {
    return (
      <div className="min-h-screen bg-[#FAF3E1] dark:bg-[#0B0B0D] text-[#222222] dark:text-[#F5F5F7] font-sans antialiased transition-colors duration-200">
        <header className="border-b border-[#E6D2A5] dark:border-[#1F1F23] bg-[#FAF3E1]/90 dark:bg-[#141416]/50 h-14 flex items-center px-6">
          <div className="h-4 w-40 bg-[#E6D2A5]/60 dark:bg-[#1C1C1F] rounded animate-pulse" />
        </header>
        <div className="flex">
          <div className="w-64 h-[calc(100vh-3.5rem)] border-r border-[#E6D2A5] dark:border-[#1F1F23] p-4 space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-8 rounded bg-[#E6D2A5]/40 dark:bg-[#1C1C1F] animate-pulse"
              />
            ))}
          </div>
          <main className="flex-1 p-8 space-y-6">
            <div className="h-20 rounded bg-[#E6D2A5]/40 dark:bg-[#1C1C1F] animate-pulse" />
            <div className="h-64 rounded bg-[#E6D2A5]/40 dark:bg-[#1C1C1F] animate-pulse" />
          </main>
        </div>
      </div>
    );
  }

  // Error State
  if (error && !currentProject) {
    return (
      <div className="min-h-screen bg-[#FAF3E1] dark:bg-[#0B0B0D] text-[#222222] dark:text-[#F5F5F7] font-sans flex items-center justify-center p-6 transition-colors duration-200">
        <div className="max-w-md w-full p-6 rounded-lg bg-[#FFFFFF] dark:bg-[#141416] border border-[#E6D2A5] dark:border-[#2C2C2E] text-center space-y-4 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-[#FEE2E2] dark:bg-[#1C1214] border border-[#FCA5A5] dark:border-[#481E24] flex items-center justify-center mx-auto text-[#DC2626] dark:text-[#F87171]">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-[#222222] dark:text-[#F5F5F7]">
              Project Not Found
            </h2>
            <p className="text-xs text-[#5C5C5C] dark:text-[#A1A1A6] mt-1">
              {typeof error === "string"
                ? error
                : error?.message || "Could not load this project workspace."}
            </p>
          </div>
          <button
            onClick={() => navigate("/dashboard")}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#FF6D1F] text-white hover:bg-[#E85B0F] text-xs font-medium transition-colors cursor-pointer"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF3E1] dark:bg-[#0B0B0D] text-[#222222] dark:text-[#F5F5F7] font-sans antialiased transition-colors duration-200 flex flex-col">
      {/* ---------------------------------------------------- */}
      {/* TOP WORKSPACE HEADER: APIPilot / {ProjectName}       */}
      {/* ---------------------------------------------------- */}
      <header className="sticky top-0 z-40 border-b border-[#E6D2A5] dark:border-[#1F1F23] bg-[#FAF3E1]/95 dark:bg-[#141416]/90 backdrop-blur-md transition-colors duration-200 shrink-0">
        <div className="w-full px-4 h-14 flex items-center justify-between">
          {/* Left: Breadcrumbs & Metadata */}
          <div className="flex items-center gap-2.5 text-xs">
            <Link
              to="/dashboard"
              className="flex items-center gap-2 font-semibold text-[#222222] dark:text-[#F5F5F7] hover:text-[#FF6D1F] transition-colors"
            >
              <div className="w-6 h-6 rounded bg-[#F5E7C6] dark:bg-[#1C1C1F] border border-[#E6D2A5] dark:border-[#2C2C2E] flex items-center justify-center text-[#FF6D1F]">
                <Terminal className="w-3.5 h-3.5" />
              </div>
              <span>APIPilot</span>
            </Link>

            <span className="text-[#8C8C8C] dark:text-[#6E6E73] font-mono">/</span>

            <div className="flex items-center gap-2">
              <span className="font-semibold text-[#222222] dark:text-[#F5F5F7]">
                {currentProject?.name}
              </span>
              <button
                type="button"
                onClick={handleCopyId}
                className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-[#F5E7C6] dark:bg-[#1C1C1F] border border-[#E6D2A5] dark:border-[#2C2C2E] text-[#5C5C5C] dark:text-[#A1A1A6] hover:text-[#222222] dark:hover:text-[#F5F5F7] transition-colors cursor-pointer"
                title="Copy Project ID"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-[#059669] dark:text-[#00E599]" />
                    <span className="text-[#059669] dark:text-[#00E599]">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>{currentProject?._id?.substring(0, 8)}...</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Center: Environment Selector */}
          <div className="hidden sm:flex items-center gap-2">
            <EnvironmentSelector
              projectId={projectId}
              selectedEnv={selectedEnvironment}
              onSelectEnv={(env) => setSelectedEnvironment(env)}
            />
          </div>

          {/* Right: Actions, Theme Toggle & User Menu */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsEditOpen(true)}
              className="p-1.5 rounded-md hover:bg-[#F5E7C6] dark:hover:bg-[#1C1C1F] text-[#5C5C5C] dark:text-[#A1A1A6] hover:text-[#222222] dark:hover:text-[#F5F5F7] border border-[#E6D2A5] dark:border-[#2C2C2E] transition-colors cursor-pointer"
              title="Edit Project Settings"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => setIsDeleteModalOpen(true)}
              className="p-1.5 rounded-md hover:bg-[#FEE2E2] dark:hover:bg-[#2A1517] text-[#5C5C5C] dark:text-[#A1A1A6] hover:text-[#DC2626] dark:hover:text-[#F87171] border border-[#E6D2A5] dark:border-[#2C2C2E] transition-colors cursor-pointer"
              title="Delete Project"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>

            <div className="h-4 w-px bg-[#E6D2A5] dark:bg-[#2C2C2E] mx-1" />

            <ThemeToggle />

            {/* User Profile Menu Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full hover:bg-[#F5E7C6] dark:hover:bg-[#1C1C1F] border border-[#E6D2A5] dark:border-[#2C2C2E] transition-colors cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full bg-[#FF6D1F] text-white flex items-center justify-center font-bold text-xs">
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <ChevronDown className="w-3 h-3 text-[#8C8C8C]" />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-lg bg-[#FFFFFF] dark:bg-[#141416] border border-[#E6D2A5] dark:border-[#2C2C2E] py-1 shadow-lg text-xs z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-2 border-b border-[#FAF3E1] dark:border-[#1F1F23]">
                    <p className="font-semibold text-[#222222] dark:text-[#F5F5F7] truncate">
                      {user?.name}
                    </p>
                    <p className="text-[11px] text-[#8C8C8C] dark:text-[#6E6E73] truncate">
                      {user?.email}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      navigate("/dashboard");
                    }}
                    className="w-full px-3 py-1.5 flex items-center gap-2 text-[#5C5C5C] dark:text-[#A1A1A6] hover:text-[#222222] dark:hover:text-[#F5F5F7] hover:bg-[#FAF3E1] dark:hover:bg-[#1C1C1F] transition-colors"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    <span>Dashboard</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full px-3 py-1.5 flex items-center gap-2 text-[#DC2626] dark:text-[#F87171] hover:bg-[#FEF2F2] dark:hover:bg-[#200B0D] transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ---------------------------------------------------- */}
      {/* POSTMAN-STYLE WORKSPACE: LEFT EXPLORER + RIGHT CANVAS */}
      {/* ---------------------------------------------------- */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left: Collections & Requests Explorer */}
        <WorkspaceExplorer
          project={currentProject}
          collections={collections || []}
          requests={requests || []}
          loading={collectionsLoading}
          activeView={activeView}
          onSelectView={(view) => setActiveView(view)}
          selectedCollection={selectedCollection}
          onSelectCollection={(col) => setSelectedCollection(col)}
          selectedRequest={currentRequest}
          onSelectRequest={handleSelectRequest}
          onNewRequest={(targetCol) => {
            setTargetCollectionForRequest(
              targetCol || selectedCollection || collections?.[0] || null
            );
            setIsCreateRequestModalOpen(true);
          }}
          onNewCollection={() => {
            setParentCollectionForCreate(null);
            setIsCreateCollectionModalOpen(true);
          }}
          onCreateSubCollection={(parentCol) => {
            setParentCollectionForCreate(parentCol);
            setIsCreateCollectionModalOpen(true);
          }}
          onEditCollection={(col) => {
            setCollectionToEdit(col);
            setIsEditCollectionModalOpen(true);
          }}
          onDeleteCollection={(col) => {
            setCollectionToDelete(col);
            setIsDeleteCollectionModalOpen(true);
          }}
          onEditRequest={(req) => {
            setRequestToEdit(req);
            setIsEditRequestModalOpen(true);
          }}
          onDeleteRequest={(req) => {
            setRequestToDelete(req);
            setIsDeleteRequestModalOpen(true);
          }}
          sidebarTab={sidebarTab}
          onSelectSidebarTab={setSidebarTab}
          selectedEnvironment={selectedEnvironment}
          onSelectEnvironment={(env) => {
            setSelectedEnvironment(env);
            setActiveView("environment");
          }}
          onSelectHistoryExecution={handleSelectHistoryExecution}
        />

        {/* Right: API Request Center or Auxiliary Views */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* 1. Request Center (Default Postman API Runner) */}
          {activeView === "request" && (
            <RequestCenter
              key={currentRequest?._id || "none"}
              project={currentProject}
              request={currentRequest}
              onNewRequest={() => {
                setTargetCollectionForRequest(
                  selectedCollection || collections?.[0] || null
                );
                setIsCreateRequestModalOpen(true);
              }}
            />
          )}

          {/* 2. History Viewer */}
          {activeView === "historyViewer" && (
            <div className="flex-1 overflow-hidden p-4">
              <RequestHistoryViewer
                execution={selectedExecutionHistory}
                onClose={() => setActiveView("request")}
                onRunAgain={(exec) => {
                  if (exec?.requestId) {
                    const matchedReq = requests.find(
                      (r) => String(r._id) === String(exec.requestId)
                    );
                    if (matchedReq) {
                      dispatch(setCurrentRequest(matchedReq));
                    }
                  }
                  setActiveView("request");
                }}
              />
            </div>
          )}

          {/* 3. Environment Details / Variables Editor */}
          {activeView === "environment" && selectedEnvironment && (
            <div className="flex-1 overflow-hidden p-4">
              <div className="h-full flex flex-col bg-[#FFFFFF] dark:bg-[#141416] border border-[#E6D2A5] dark:border-[#2C2C2E] rounded-lg p-4">
                <EnvironmentEditor
                  environment={selectedEnvironment}
                  projectId={projectId}
                  onDelete={() => {
                    setSelectedEnvironment(null);
                    setActiveView("request");
                  }}
                />
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ---------------------------------------------------- */}
      {/* MODALS */}
      {/* ---------------------------------------------------- */}
      <CreateCollectionModal
        isOpen={isCreateCollectionModalOpen}
        onClose={() => {
          setIsCreateCollectionModalOpen(false);
          setParentCollectionForCreate(null);
        }}
        projectId={projectId}
        parentCollection={parentCollectionForCreate}
      />

      <EditCollectionModal
        isOpen={isEditCollectionModalOpen}
        onClose={() => {
          setIsEditCollectionModalOpen(false);
          setCollectionToEdit(null);
        }}
        projectId={projectId}
        collection={collectionToEdit}
      />

      <DeleteCollectionModal
        isOpen={isDeleteCollectionModalOpen}
        onClose={() => {
          setIsDeleteCollectionModalOpen(false);
          setCollectionToDelete(null);
        }}
        projectId={projectId}
        collection={collectionToDelete}
      />

      <CreateRequestModal
        isOpen={isCreateRequestModalOpen}
        onClose={() => {
          setIsCreateRequestModalOpen(false);
          setTargetCollectionForRequest(null);
        }}
        projectId={projectId}
        collection={targetCollectionForRequest}
      />

      <EditRequestModal
        isOpen={isEditRequestModalOpen}
        onClose={() => {
          setIsEditRequestModalOpen(false);
          setRequestToEdit(null);
        }}
        projectId={projectId}
        request={requestToEdit}
      />

      <DeleteRequestModal
        isOpen={isDeleteRequestModalOpen}
        onClose={() => {
          setIsDeleteRequestModalOpen(false);
          setRequestToDelete(null);
        }}
        projectId={projectId}
        request={requestToDelete}
      />

      <EditProjectModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
      />

      <DeleteProjectModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        project={currentProject}
        onDeleted={() => navigate("/dashboard")}
      />
    </div>
  );
}

export default ProjectWorkspacePage;