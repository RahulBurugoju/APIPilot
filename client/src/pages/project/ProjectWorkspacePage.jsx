import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link, useNavigate } from "react-router-dom";
import projectThunks from "../../features/project/project.thunk";
import collectionThunk from "../../features/collection/collection.thunk";
import ThemeToggle from "../../components/common/ThemeToggle";
import EditProjectModal from "../../components/projects/EditProjectModal";
import DeleteProjectModal from "../../components/projects/DeleteProjectModal";
import CreateCollectionForm from "../../components/collections/CreateCollectionForm";
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

  const [copied, setCopied] = useState(false);
  const [activeNav, setActiveNav] = useState("overview");
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Modal / Form Visibility States
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCreateCollectionOpen, setIsCreateCollectionOpen] = useState(false);

  useEffect(() => {
    if (projectId) {
      dispatch(projectThunks.getProject({ projectId }));
      dispatch(collectionThunk.getProjectCollections({ projectId }));
    }
  }, [projectId, dispatch]);

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
          <div className="w-60 h-[calc(100vh-3.5rem)] border-r border-[#E6D2A5] dark:border-[#1F1F23] p-4 space-y-3">
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

  const formattedDate = currentProject?.updatedAt
    ? new Date(currentProject.updatedAt).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Recently";

  return (
    <div className="min-h-screen bg-[#FAF3E1] dark:bg-[#0B0B0D] text-[#222222] dark:text-[#F5F5F7] font-sans antialiased transition-colors duration-200 flex flex-col">
      {/* ---------------------------------------------------- */}
      {/* TOP HEADER: APIPilot / {ProjectName}         User ▾  */}
      {/* ---------------------------------------------------- */}
      <header className="sticky top-0 z-40 border-b border-[#E6D2A5] dark:border-[#1F1F23] bg-[#FAF3E1]/95 dark:bg-[#141416]/90 backdrop-blur-md transition-colors duration-200">
        <div className="w-full px-4 sm:px-6 h-14 flex items-center justify-between">
          {/* Left: Breadcrumbs */}
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

            <span className="font-semibold text-[#222222] dark:text-[#F5F5F7] truncate max-w-[200px] sm:max-w-md">
              {currentProject?.name || "My API"}
            </span>
          </div>

          {/* Right: Theme Toggle & User Menu */}
          <div className="flex items-center gap-3">
            <ThemeToggle />

            {/* User Dropdown Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-[#FFFFFF] dark:bg-[#1C1C1F] hover:bg-[#F5E7C6] dark:hover:bg-[#2C2C2E] border border-[#E6D2A5] dark:border-[#2C2C2E] text-xs font-medium text-[#222222] dark:text-[#F5F5F7] transition-colors cursor-pointer select-none"
              >
                <span className="truncate max-w-[120px]">
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
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-[#DC2626] dark:text-[#F87171] hover:bg-[#FEE2E2] dark:hover:bg-[#2A1517] transition-colors text-left cursor-pointer"
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
      {/* WORKSPACE BODY: SIDEBAR + MAIN CANVAS                */}
      {/* ---------------------------------------------------- */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Left Sidebar */}
        <aside className="w-full md:w-60 border-b md:border-b-0 md:border-r border-[#E6D2A5] dark:border-[#1F1F23] bg-[#FAF3E1]/70 dark:bg-[#101012]/60 p-4 space-y-6 shrink-0 transition-colors duration-200">
          <div>
            <div className="px-3 mb-3">
              <h2 className="text-xs font-bold text-[#222222] dark:text-[#F5F5F7] truncate">
                {currentProject?.name || "APIPilot API"}
              </h2>
              <p className="text-[10px] text-[#8C8C8C] dark:text-[#6E6E73] font-mono">
                {currentProject?.projectType?.toUpperCase() || "REST"} Workspace
              </p>
            </div>

            <nav className="space-y-1">
              {/* Overview */}
              <button
                type="button"
                onClick={() => setActiveNav("overview")}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  activeNav === "overview"
                    ? "bg-[#FF6D1F] text-white shadow-xs font-semibold"
                    : "text-[#5C5C5C] dark:text-[#A1A1A6] hover:bg-[#F5E7C6] dark:hover:bg-[#1C1C1F] hover:text-[#222222] dark:hover:text-[#F5F5F7]"
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Overview</span>
              </button>

              {/* Collections (Real Functionality) */}
              <button
                type="button"
                onClick={() => setActiveNav("collections")}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  activeNav === "collections"
                    ? "bg-[#FF6D1F] text-white shadow-xs font-semibold"
                    : "text-[#5C5C5C] dark:text-[#A1A1A6] hover:bg-[#F5E7C6] dark:hover:bg-[#1C1C1F] hover:text-[#222222] dark:hover:text-[#F5F5F7]"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FolderTree className="w-4 h-4" />
                  <span>Collections</span>
                </div>
                {Array.isArray(collections) && collections.length > 0 && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      activeNav === "collections"
                        ? "bg-white/20 text-white"
                        : "bg-[#E6D2A5] dark:bg-[#2C2C2E] text-[#222222] dark:text-[#F5F5F7]"
                    }`}
                  >
                    {collections.length}
                  </span>
                )}
              </button>

              {/* Environments (Placeholder) */}
              <button
                type="button"
                onClick={() => setActiveNav("environments")}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  activeNav === "environments"
                    ? "bg-[#FF6D1F] text-white shadow-xs font-semibold"
                    : "text-[#5C5C5C] dark:text-[#A1A1A6] hover:bg-[#F5E7C6] dark:hover:bg-[#1C1C1F] hover:text-[#222222] dark:hover:text-[#F5F5F7]"
                }`}
              >
                <Sliders className="w-4 h-4" />
                <span>Environments</span>
              </button>

              {/* History (Placeholder) */}
              <button
                type="button"
                onClick={() => setActiveNav("history")}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  activeNav === "history"
                    ? "bg-[#FF6D1F] text-white shadow-xs font-semibold"
                    : "text-[#5C5C5C] dark:text-[#A1A1A6] hover:bg-[#F5E7C6] dark:hover:bg-[#1C1C1F] hover:text-[#222222] dark:hover:text-[#F5F5F7]"
                }`}
              >
                <History className="w-4 h-4" />
                <span>History</span>
              </button>

              {/* Settings */}
              <button
                type="button"
                onClick={() => setIsEditOpen(true)}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium text-[#5C5C5C] dark:text-[#A1A1A6] hover:bg-[#F5E7C6] dark:hover:bg-[#1C1C1F] hover:text-[#222222] dark:hover:text-[#F5F5F7] transition-colors cursor-pointer"
              >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </button>
            </nav>
          </div>
        </aside>

        {/* Right Main Content Canvas */}
        <main className="flex-1 p-6 md:p-8 space-y-6 max-w-8xl">
          {/* Project Title & Summary Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-2 max-w-3xl">
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

              {/* Base URL & Settings Badges */}
              <div className="flex flex-wrap items-center gap-2.5 pt-1 text-[11px] text-[#5C5C5C] dark:text-[#A1A1A6]">
                {currentProject?.baseUrl && (
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#FAF3E1] dark:bg-[#1C1C1F] border border-[#E6D2A5] dark:border-[#2C2C2E] font-mono">
                    <span className="text-[#8C8C8C] dark:text-[#6E6E73]">Base URL:</span>
                    <span className="text-[#222222] dark:text-[#F5F5F7] truncate max-w-xs">
                      {currentProject.baseUrl}
                    </span>
                  </div>
                )}

                {currentProject?.settings?.defaultTimeout && (
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#FAF3E1] dark:bg-[#1C1C1F] border border-[#E6D2A5] dark:border-[#2C2C2E] font-mono text-[10px]">
                    <Clock className="w-3 h-3 text-[#8C8C8C] dark:text-[#6E6E73]" />
                    <span>{currentProject.settings.defaultTimeout}ms timeout</span>
                  </div>
                )}

                {/* AutoSave Indicator */}
                <div
                  className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded border font-mono text-[10px] ${
                    currentProject?.settings?.autoSave ?? true
                      ? "bg-[#ECFDF5] dark:bg-[#062417] text-[#059669] dark:text-[#00E599] border-[#A7F3D0] dark:border-[#104D30]"
                      : "bg-[#F3F4F6] dark:bg-[#1C1C1F] text-[#6B7280] dark:text-[#8E8E93] border-[#E5E7EB] dark:border-[#2C2C2E]"
                  }`}
                  title={
                    currentProject?.settings?.autoSave ?? true
                      ? "Auto-save is enabled"
                      : "Auto-save is disabled"
                  }
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      (currentProject?.settings?.autoSave ?? true)
                        ? "bg-[#059669] dark:bg-[#00E599] animate-pulse"
                        : "bg-[#9CA3AF]"
                    }`}
                  />
                  <span>
                    Auto-save:{" "}
                    {(currentProject?.settings?.autoSave ?? true) ? "ON" : "OFF"}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions (Edit, Delete, Copy ID) */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setIsEditOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#FFFFFF] dark:bg-[#1C1C1F] hover:bg-[#F5E7C6] dark:hover:bg-[#2C2C2E] text-[#222222] dark:text-[#F5F5F7] border border-[#E6D2A5] dark:border-[#2C2C2E] text-xs font-medium transition-colors cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5 text-[#5C5C5C] dark:text-[#A1A1A6]" />
                <span>Edit</span>
              </button>

              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#FFFFFF] dark:bg-[#1C1C1F] hover:bg-[#FEE2E2] dark:hover:bg-[#2A1517] text-[#DC2626] dark:text-[#F87171] border border-[#FCA5A5] dark:border-[#481E24] text-xs font-medium transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>

              {currentProject?._id && (
                <button
                  type="button"
                  onClick={handleCopyId}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded bg-[#FAF3E1] dark:bg-[#1C1C1F] border border-[#E6D2A5] dark:border-[#2C2C2E] text-[11px] font-mono text-[#5C5C5C] dark:text-[#A1A1A6] hover:text-[#222222] dark:hover:text-[#F5F5F7] transition-colors cursor-pointer"
                  title="Copy Project ID"
                >
                  <span>ID: {currentProject._id.slice(-6)}</span>
                  {copied ? (
                    <Check className="w-3 h-3 text-[#FF6D1F]" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Horizontal Line Divider */}
          <hr className="border-[#E6D2A5] dark:border-[#1F1F23]" />

          {/* Dynamic Content Views */}
          {activeNav === "overview" && (
            <div className="space-y-6">
              {/* Collections Card Shortcut */}
              <div className="p-6 rounded-lg bg-[#FFFFFF] dark:bg-[#141416] border border-[#E6D2A5] dark:border-[#2C2C2E] space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FolderTree className="w-4 h-4 text-[#FF6D1F]" />
                    <h3 className="text-sm font-semibold text-[#222222] dark:text-[#F5F5F7]">
                      Collections
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveNav("collections")}
                    className="inline-flex items-center gap-1 text-xs text-[#FF6D1F] hover:underline font-medium cursor-pointer"
                  >
                    <span>View all</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-xs text-[#5C5C5C] dark:text-[#A1A1A6] leading-relaxed">
                  {Array.isArray(collections) && collections.length > 0
                    ? `This project currently has ${collections.length} collection${
                        collections.length > 1 ? "s" : ""
                      }. Organize endpoints and test suites.`
                    : "No collections created yet. Group your API endpoints into structured collections, folders, and modules."}
                </p>
              </div>

              {/* Environments Card Shortcut */}
              <div className="p-6 rounded-lg bg-[#FFFFFF] dark:bg-[#141416] border border-[#E6D2A5] dark:border-[#2C2C2E] space-y-2 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-[#FF6D1F]" />
                    <h3 className="text-sm font-semibold text-[#222222] dark:text-[#F5F5F7]">
                      Environments
                    </h3>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-[#FAF3E1] dark:bg-[#1C1C1F] border border-[#E6D2A5] dark:border-[#2C2C2E] text-[10px] font-mono font-medium text-[#FF6D1F]">
                    Coming soon
                  </span>
                </div>
                <p className="text-xs text-[#5C5C5C] dark:text-[#A1A1A6] leading-relaxed">
                  Configure dynamic environment variables (Base URLs, Bearer Tokens, API Keys) for Local, Staging, and Production.
                </p>
              </div>

              {/* History Card Shortcut */}
              <div className="p-6 rounded-lg bg-[#FFFFFF] dark:bg-[#141416] border border-[#E6D2A5] dark:border-[#2C2C2E] space-y-2 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <History className="w-4 h-4 text-[#FF6D1F]" />
                    <h3 className="text-sm font-semibold text-[#222222] dark:text-[#F5F5F7]">
                      History
                    </h3>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-[#FAF3E1] dark:bg-[#1C1C1F] border border-[#E6D2A5] dark:border-[#2C2C2E] text-[10px] font-mono font-medium text-[#FF6D1F]">
                    Coming soon
                  </span>
                </div>
                <p className="text-xs text-[#5C5C5C] dark:text-[#A1A1A6] leading-relaxed">
                  Inspect recently executed HTTP requests, response timing logs, and debug inspection snapshots.
                </p>
              </div>
            </div>
          )}

          {/* Collections Tab (Real Functionality) */}
          {activeNav === "collections" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold text-[#222222] dark:text-[#F5F5F7]">
                    Project Collections
                  </h2>
                  <p className="text-xs text-[#5C5C5C] dark:text-[#A1A1A6]">
                    Organize your API endpoints into modular collections and folders.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsCreateCollectionOpen(!isCreateCollectionOpen)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-[#FF6D1F] text-white hover:bg-[#E85B0F] text-xs font-medium transition-colors shadow-sm cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isCreateCollectionOpen ? "Cancel" : "New Collection"}</span>
                </button>
              </div>

              {/* Inline Create Collection Form */}
              {isCreateCollectionOpen && (
                <div className="max-w-lg animate-in fade-in zoom-in-95 duration-150">
                  <CreateCollectionForm
                    projectId={projectId}
                    onCancel={() => setIsCreateCollectionOpen(false)}
                    onSuccess={() => setIsCreateCollectionOpen(false)}
                  />
                </div>
              )}

              {/* Collections List or Empty State */}
              {collectionsLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[1, 2].map((i) => (
                    <div
                      key={i}
                      className="h-28 rounded-lg bg-[#FFFFFF] dark:bg-[#141416] border border-[#E6D2A5] dark:border-[#2C2C2E] animate-pulse p-4"
                    />
                  ))}
                </div>
              ) : Array.isArray(collections) && collections.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {collections.map((col) => (
                    <div
                      key={col._id}
                      className="p-4 rounded-lg bg-[#FFFFFF] dark:bg-[#141416] border border-[#E6D2A5] dark:border-[#2C2C2E] hover:border-[#FF6D1F] dark:hover:border-[#6E6E73] transition-colors shadow-xs cursor-pointer"
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <Folder className="w-4 h-4 text-[#FF6D1F]" />
                        <h3 className="text-xs font-semibold text-[#222222] dark:text-[#F5F5F7] truncate">
                          {col.name}
                        </h3>
                      </div>
                      <p className="text-[11px] text-[#5C5C5C] dark:text-[#A1A1A6] line-clamp-2">
                        {col.description || "No description provided."}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <WorkspacePlaceholder
                  title="No collections yet"
                  description="Collections allow you to group related endpoints, requests, and shared headers."
                  type="collections"
                  actionText="Create First Collection"
                  onAction={() => setIsCreateCollectionOpen(true)}
                />
              )}
            </div>
          )}

          {/* Environments Tab (Placeholder) */}
          {activeNav === "environments" && (
            <WorkspacePlaceholder
              title="Environment Variables"
              description="Manage environment variables, secret vaults, and base URLs across Localhost, Staging, and Production."
              type="environments"
            />
          )}

          {/* History Tab (Placeholder) */}
          {activeNav === "history" && (
            <WorkspacePlaceholder
              title="Request History"
              description="View executed requests, audit logs, and response inspect history for this project."
              type="default"
            />
          )}
        </main>
      </div>

      {/* ---------------------------------------------------- */}
      {/* EXTRACTED EDIT & DELETE MODALS */}
      {/* ---------------------------------------------------- */}
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