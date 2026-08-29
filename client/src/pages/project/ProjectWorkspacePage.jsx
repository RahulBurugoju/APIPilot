import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link, useNavigate } from "react-router-dom";
import projectThunks from "../../features/project/project.thunk";
import collectionThunk from "../../features/collection/collection.thunk";
import ThemeToggle from "../../components/common/ThemeToggle";
import EditProjectModal from "../../components/projects/EditProjectModal";
import DeleteProjectModal from "../../components/projects/DeleteProjectModal";
import CreateCollectionModal from "../../components/collections/CreateCollectionModal";
import DeleteCollectionModal from "../../components/collections/DeleteCollectionModal";
import CreateRequestModal from "../../components/requests/CreateRequestModal";
import RequestList from "../../components/requests/RequestList";
import requestThunk from "../../features/request/request.Thunk.js";
import CollectionList from "../../components/collections/CollectionList";
import WorkspaceExplorer from "../../components/workspace/WorkspaceExplorer";
import RequestCenter from "../../components/workspace/RequestCenter";
import WorkspacePlaceholder from "../../components/workspace/WorkspacePlaceholder";
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
  const [activeView, setActiveView] = useState("request"); // 'request' | 'overview' | 'collections' | 'environments' | 'history'
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Modal / Form Visibility States
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCreateCollectionModalOpen, setIsCreateCollectionModalOpen] =
    useState(false);
  const [parentCollectionForCreate, setParentCollectionForCreate] =
    useState(null);
  const [collectionToDelete, setCollectionToDelete] = useState(null);
  const [isDeleteCollectionModalOpen, setIsDeleteCollectionModalOpen] =
    useState(false);
  const [isCreateRequestModalOpen, setIsCreateRequestModalOpen] =
    useState(false);
  const [targetCollectionForRequest, setTargetCollectionForRequest] =
    useState(null);

  useEffect(() => {
    if (projectId) {
      dispatch(projectThunks.getProject({ projectId }));
      dispatch(collectionThunk.getProjectCollections({ projectId }));
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

            <span className="font-semibold text-[#222222] dark:text-[#F5F5F7] truncate max-w-[180px] sm:max-w-xs">
              {currentProject?.name || "My API"}
            </span>

            <span className="px-1.5 py-0.5 rounded bg-[#FAF3E1] dark:bg-[#1C1C1F] border border-[#E6D2A5] dark:border-[#2C2C2E] text-[10px] font-mono font-semibold uppercase text-[#FF6D1F]">
              {currentProject?.projectType || "REST"}
            </span>

            {/* Live Auto-save status */}
            <div
              className={`hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-medium border ${
                currentProject?.settings?.autoSave ?? true
                  ? "bg-[#ECFDF5] dark:bg-[#062417] text-[#059669] dark:text-[#00E599] border-[#A7F3D0] dark:border-[#104D30]"
                  : "bg-[#F3F4F6] dark:bg-[#1C1C1F] text-[#6B7280] dark:text-[#8E8E93] border-[#E5E7EB] dark:border-[#2C2C2E]"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  (currentProject?.settings?.autoSave ?? true)
                    ? "bg-[#059669] dark:bg-[#00E599] animate-pulse"
                    : "bg-[#9CA3AF]"
                }`}
              />
              <span>
                Auto-save {(currentProject?.settings?.autoSave ?? true) ? "ON" : "OFF"}
              </span>
            </div>
          </div>

          {/* Right: Quick actions, Theme Toggle & User Menu */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsEditOpen(true)}
              className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-[#FFFFFF] dark:bg-[#1C1C1F] hover:bg-[#F5E7C6] dark:hover:bg-[#2C2C2E] text-[#222222] dark:text-[#F5F5F7] border border-[#E6D2A5] dark:border-[#2C2C2E] text-xs font-medium transition-colors cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5 text-[#5C5C5C] dark:text-[#A1A1A6]" />
              <span>Settings</span>
            </button>

            <ThemeToggle />

            {/* User Dropdown Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-[#FFFFFF] dark:bg-[#1C1C1F] hover:bg-[#F5E7C6] dark:hover:bg-[#2C2C2E] border border-[#E6D2A5] dark:border-[#2C2C2E] text-xs font-medium text-[#222222] dark:text-[#F5F5F7] transition-colors cursor-pointer select-none"
              >
                <span className="truncate max-w-[100px]">
                  {user?.name || user?.email?.split("@")[0] || "User"}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-[#8C8C8C] dark:text-[#6E6E73]" />
              </button>

              {isUserMenuOpen && (
                <div
                  className="absolute right-0 mt-1.5 w-48 rounded-lg bg-[#FFFFFF] dark:bg-[#141416] border border-[#E6D2A5] dark:border-[#2C2C2E] shadow-lg py-1.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-100"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-[#FAF3E1] dark:border-[#1F1F23]">
                    <p className="font-semibold text-[#222222] dark:text-[#F5F5F7] truncate">
                      {user?.name || "User Account"}
                    </p>
                    <p className="text-[11px] text-[#8C8C8C] dark:text-[#6E6E73] truncate">
                      {user?.email}
                    </p>
                  </div>

                  <Link
                    to="/dashboard"
                    className="flex items-center gap-2 px-3 py-2 text-[#5C5C5C] dark:text-[#A1A1A6] hover:bg-[#FAF3E1] dark:hover:bg-[#1C1C1F] hover:text-[#222222] dark:hover:text-[#F5F5F7] transition-colors"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    <span>All Projects</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      setIsDeleteModalOpen(true);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-[#DC2626] dark:text-[#F87171] hover:bg-[#FEE2E2] dark:hover:bg-[#2A1517] transition-colors text-left cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Project</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-[#5C5C5C] dark:text-[#A1A1A6] hover:bg-[#FAF3E1] dark:hover:bg-[#1C1C1F] hover:text-[#222222] dark:hover:text-[#F5F5F7] transition-colors text-left cursor-pointer border-t border-[#FAF3E1] dark:border-[#1F1F23]"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign out</span>
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
          selectedRequest={selectedRequest || currentRequest}
          onSelectRequest={(req) => {
            setSelectedRequest(req);
            setActiveView("request");
          }}
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
          onDeleteCollection={(col) => {
            setCollectionToDelete(col);
            setIsDeleteCollectionModalOpen(true);
          }}
        />

        {/* Right: API Request Center or Auxiliary Views */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* 1. Request Center (Default Postman API Runner) */}
          {activeView === "request" && (
            <RequestCenter
              project={currentProject}
              request={selectedRequest}
              onNewRequest={() => {
                setSelectedRequest({
                  id: `req-${Date.now()}`,
                  name: "New Request",
                  method: "GET",
                  path: "/api/v1",
                });
              }}
            />
          )}

          {/* 2. Overview Canvas */}
          {activeView === "overview" && (
            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 max-w-5xl">
              {/* Project Title & Badges */}
              <div className="space-y-3">
                <div className="flex items-center gap-2.5">
                  <h1 className="text-2xl font-bold text-[#222222] dark:text-[#F5F5F7] tracking-tight">
                    {currentProject?.name || "My API"}
                  </h1>
                  <span className="px-2 py-0.5 rounded bg-[#FAF3E1] dark:bg-[#1C1C1F] border border-[#E6D2A5] dark:border-[#2C2C2E] text-[10px] font-mono font-semibold uppercase text-[#FF6D1F]">
                    {currentProject?.projectType || "REST"}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-[#5C5C5C] dark:text-[#A1A1A6]">
                  {currentProject?.description ||
                    "Backend API development workspace"}
                </p>

                {currentProject?.baseUrl && (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#FAF3E1] dark:bg-[#1C1C1F] border border-[#E6D2A5] dark:border-[#2C2C2E] font-mono text-xs">
                    <span className="text-[#8C8C8C] dark:text-[#6E6E73]">Base URL:</span>
                    <span className="text-[#222222] dark:text-[#F5F5F7]">
                      {currentProject.baseUrl}
                    </span>
                  </div>
                )}
              </div>

              <hr className="border-[#E6D2A5] dark:border-[#1F1F23]" />

              {/* Collections Summary List */}
              <CollectionList
                collections={collections || []}
                loading={collectionsLoading}
                onCreateClick={() => setIsCreateCollectionModalOpen(true)}
              />

              <hr className="border-[#E6D2A5] dark:border-[#1F1F23]" />

              {/* Request List Component (Spec 02.8.15) */}
              <RequestList
                collectionName={
                  selectedCollection?.name || "All Workspace Requests"
                }
                requests={
                  selectedCollection
                    ? (requests || []).filter(
                        (r) =>
                          r.collection &&
                          String(r.collection) === String(selectedCollection._id)
                      )
                    : requests || []
                }
                selectedRequestId={selectedRequest?._id}
                onSelectRequest={(req) => {
                  setSelectedRequest(req);
                  setActiveView("request");
                }}
                onCreateRequestClick={() => {
                  setTargetCollectionForRequest(
                    selectedCollection || collections?.[0] || null
                  );
                  setIsCreateRequestModalOpen(true);
                }}
              />
            </div>
          )}

          {/* 3. Collections View (Displays Collections and Request List) */}
          {activeView === "collections" && (
            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 max-w-5xl">
              <CollectionList
                collections={collections || []}
                loading={collectionsLoading}
                onCreateClick={() => setIsCreateCollectionModalOpen(true)}
              />

              <hr className="border-[#E6D2A5] dark:border-[#1F1F23]" />

              <RequestList
                collectionName={
                  selectedCollection?.name || "All Requests"
                }
                requests={
                  selectedCollection
                    ? (requests || []).filter(
                        (r) =>
                          r.collection &&
                          String(r.collection) === String(selectedCollection._id)
                      )
                    : requests || []
                }
                selectedRequestId={selectedRequest?._id}
                onSelectRequest={(req) => {
                  setSelectedRequest(req);
                  setActiveView("request");
                }}
                onCreateRequestClick={() => {
                  setTargetCollectionForRequest(
                    selectedCollection || collections?.[0] || null
                  );
                  setIsCreateRequestModalOpen(true);
                }}
              />
            </div>
          )}

          {/* 4. Environments Tab */}
          {activeView === "environments" && (
            <div className="flex-1 p-6">
              <WorkspacePlaceholder
                title="Environment Variables"
                description="Manage global and scoped environment variables, secret vaults, and dynamic base URLs."
                type="environments"
              />
            </div>
          )}

          {/* 5. History Tab */}
          {activeView === "history" && (
            <div className="flex-1 p-6">
              <WorkspacePlaceholder
                title="Request History"
                description="Inspect past executed requests, timeline waterfall timings, and response headers."
                type="default"
              />
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

      <CreateRequestModal
        isOpen={isCreateRequestModalOpen}
        onClose={() => {
          setIsCreateRequestModalOpen(false);
          setTargetCollectionForRequest(null);
        }}
        projectId={projectId}
        collection={targetCollectionForRequest}
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