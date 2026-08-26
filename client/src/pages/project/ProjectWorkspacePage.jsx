import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link, useNavigate } from "react-router-dom";
import projectThunks from "../../features/project/project.thunk";
import ThemeToggle from "../../components/common/ThemeToggle";
import EditProjectModal from "../../components/projects/EditProjectModal";
import DeleteProjectModal from "../../components/projects/DeleteProjectModal";
import {
  ArrowLeft,
  Folder,
  Clock,
  Copy,
  Check,
  AlertCircle,
  Plus,
  Send,
  Sliders,
  Layers,
  Code,
  Edit2,
  Trash2,
} from "lucide-react";

function ProjectWorkspacePage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentProject, loading, error } = useSelector(
    (state) => state.project
  );
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("endpoints");

  // Modal Visibility States
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    if (projectId) {
      dispatch(projectThunks.getProject({ projectId }));
    }
  }, [projectId, dispatch]);

  const handleCopyId = () => {
    if (currentProject?._id) {
      navigator.clipboard.writeText(currentProject._id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Loading State
  if (loading && !currentProject) {
    return (
      <div className="min-h-screen bg-[#FAF3E1] dark:bg-[#0B0B0D] text-[#222222] dark:text-[#F5F5F7] font-sans antialiased transition-colors duration-200">
        <header className="border-b border-[#E6D2A5] dark:border-[#1F1F23] bg-[#FAF3E1]/90 dark:bg-[#141416]/50 h-14 flex items-center px-6">
          <div className="h-4 w-36 bg-[#E6D2A5]/60 dark:bg-[#1C1C1F] rounded animate-pulse" />
        </header>
        <main className="max-w-7xl mx-auto px-6 py-10 space-y-6">
          <div className="h-28 rounded-lg bg-[#FFFFFF] dark:bg-[#141416] border border-[#E6D2A5] dark:border-[#2C2C2E] p-6 animate-pulse" />
          <div className="h-64 rounded-lg bg-[#FFFFFF] dark:bg-[#141416] border border-[#E6D2A5] dark:border-[#2C2C2E] animate-pulse" />
        </main>
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
            <ArrowLeft className="w-3.5 h-3.5" />
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
      {/* TOP WORKSPACE NAVIGATION */}
      {/* ---------------------------------------------------- */}
      <header className="sticky top-0 z-40 border-b border-[#E6D2A5] dark:border-[#1F1F23] bg-[#FAF3E1]/90 dark:bg-[#141416]/80 backdrop-blur-md transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          {/* Left: Breadcrumbs / Back */}
          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="p-1.5 rounded-md hover:bg-[#F5E7C6] dark:hover:bg-[#1C1C1F] text-[#5C5C5C] dark:text-[#A1A1A6] hover:text-[#222222] dark:hover:text-[#F5F5F7] transition-colors"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <div className="flex items-center gap-2 text-xs font-medium">
              <Link
                to="/dashboard"
                className="text-[#5C5C5C] dark:text-[#A1A1A6] hover:text-[#222222] dark:hover:text-[#F5F5F7] transition-colors"
              >
                Projects
              </Link>
              <span className="text-[#8C8C8C] dark:text-[#6E6E73]">/</span>
              <span className="text-[#222222] dark:text-[#F5F5F7] font-semibold truncate max-w-[200px] sm:max-w-xs">
                {currentProject?.name || "Workspace"}
              </span>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              to="/dashboard"
              className="px-3 py-1.5 rounded-md bg-[#FFFFFF] dark:bg-[#1C1C1F] hover:bg-[#F5E7C6] dark:hover:bg-[#2C2C2E] text-[#222222] dark:text-[#A1A1A6] hover:text-[#FF6D1F] dark:hover:text-[#F5F5F7] border border-[#E6D2A5] dark:border-[#2C2C2E] text-xs transition-colors"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* ---------------------------------------------------- */}
      {/* MAIN WORKSPACE BODY */}
      {/* ---------------------------------------------------- */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-6 flex-1">
        {/* Project Header Banner Card */}
        <div className="p-6 rounded-lg bg-[#FFFFFF] dark:bg-[#141416] border border-[#E6D2A5] dark:border-[#2C2C2E] shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-1.5 max-w-3xl">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-md bg-[#FAF3E1] dark:bg-[#1C1C1F] border border-[#E6D2A5] dark:border-[#2C2C2E] flex items-center justify-center text-[#FF6D1F]">
                  <Folder className="w-4 h-4" />
                </div>
                <h1 className="text-xl sm:text-2xl font-semibold text-[#222222] dark:text-[#F5F5F7] tracking-tight">
                  {currentProject?.name}
                </h1>
              </div>

              <p className="text-xs sm:text-sm text-[#5C5C5C] dark:text-[#A1A1A6] leading-relaxed pt-1">
                {currentProject?.description ||
                  "No description provided for this collection."}
              </p>
            </div>

            {/* Right: Actions & Metadata */}
            <div className="flex flex-col sm:items-end gap-3 shrink-0">
              {/* Edit & Delete Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#FFFFFF] dark:bg-[#1C1C1F] hover:bg-[#F5E7C6] dark:hover:bg-[#2C2C2E] text-[#222222] dark:text-[#F5F5F7] border border-[#E6D2A5] dark:border-[#2C2C2E] text-xs font-medium transition-colors cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5 text-[#5C5C5C] dark:text-[#A1A1A6]" />
                  <span>Edit Project</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#FFFFFF] dark:bg-[#1C1C1F] hover:bg-[#FEE2E2] dark:hover:bg-[#2A1517] text-[#DC2626] dark:text-[#F87171] border border-[#FCA5A5] dark:border-[#481E24] text-xs font-medium transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Project</span>
                </button>
              </div>

              {/* Metadata Badges */}
              <div className="flex items-center gap-2.5 text-[11px] text-[#8C8C8C] dark:text-[#6E6E73] font-mono">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>Updated {formattedDate}</span>
                </div>

                {currentProject?._id && (
                  <button
                    type="button"
                    onClick={handleCopyId}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#FAF3E1] dark:bg-[#1C1C1F] border border-[#E6D2A5] dark:border-[#2C2C2E] text-[#5C5C5C] dark:text-[#A1A1A6] hover:text-[#222222] dark:hover:text-[#F5F5F7] transition-colors cursor-pointer"
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
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-[#E6D2A5] dark:border-[#1F1F23] pb-px text-xs font-medium">
          <button
            type="button"
            onClick={() => setActiveTab("endpoints")}
            className={`pb-2.5 px-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === "endpoints"
                ? "border-[#FF6D1F] text-[#FF6D1F] dark:text-white"
                : "border-transparent text-[#5C5C5C] dark:text-[#A1A1A6] hover:text-[#222222] dark:hover:text-[#F5F5F7]"
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>Endpoints & Requests</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("environments")}
            className={`pb-2.5 px-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === "environments"
                ? "border-[#FF6D1F] text-[#FF6D1F] dark:text-white"
                : "border-transparent text-[#5C5C5C] dark:text-[#A1A1A6] hover:text-[#222222] dark:hover:text-[#F5F5F7]"
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Environments</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("schema")}
            className={`pb-2.5 px-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === "schema"
                ? "border-[#FF6D1F] text-[#FF6D1F] dark:text-white"
                : "border-transparent text-[#5C5C5C] dark:text-[#A1A1A6] hover:text-[#222222] dark:hover:text-[#F5F5F7]"
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Contract & Schema</span>
          </button>
        </div>

        {/* Tab Content Areas */}
        {activeTab === "endpoints" && (
          <div className="p-8 rounded-lg bg-[#FFFFFF] dark:bg-[#141416] border border-[#E6D2A5] dark:border-[#2C2C2E] text-center space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-full bg-[#FAF3E1] dark:bg-[#1C1C1F] border border-[#E6D2A5] dark:border-[#2C2C2E] flex items-center justify-center mx-auto text-[#FF6D1F]">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-[#222222] dark:text-[#F5F5F7]">
              No endpoints in this workspace yet
            </h3>
            <p className="text-xs text-[#5C5C5C] dark:text-[#A1A1A6] max-w-sm mx-auto">
              Start building your API collection by creating your first HTTP endpoint request.
            </p>
            <div className="pt-2">
              <button
                type="button"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-[#FF6D1F] text-white hover:bg-[#E85B0F] text-xs font-medium transition-colors shadow-sm cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                New Request
              </button>
            </div>
          </div>
        )}

        {activeTab === "environments" && (
          <div className="p-8 rounded-lg bg-[#FFFFFF] dark:bg-[#141416] border border-[#E6D2A5] dark:border-[#2C2C2E] text-center space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-full bg-[#FAF3E1] dark:bg-[#1C1C1F] border border-[#E6D2A5] dark:border-[#2C2C2E] flex items-center justify-center mx-auto text-[#FF6D1F]">
              <Sliders className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-[#222222] dark:text-[#F5F5F7]">
              Default Environment: Staging
            </h3>
            <p className="text-xs text-[#5C5C5C] dark:text-[#A1A1A6] max-w-sm mx-auto">
              Manage base URLs, API keys, and environment variables scoped to this project.
            </p>
          </div>
        )}

        {activeTab === "schema" && (
          <div className="p-8 rounded-lg bg-[#FFFFFF] dark:bg-[#141416] border border-[#E6D2A5] dark:border-[#2C2C2E] text-center space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-full bg-[#FAF3E1] dark:bg-[#1C1C1F] border border-[#E6D2A5] dark:border-[#2C2C2E] flex items-center justify-center mx-auto text-[#FF6D1F]">
              <Code className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-[#222222] dark:text-[#F5F5F7]">
              OpenAPI & Contract Specifications
            </h3>
            <p className="text-xs text-[#5C5C5C] dark:text-[#A1A1A6] max-w-sm mx-auto">
              Import OpenAPI 3.0 specs or generate schemas automatically from tested responses.
            </p>
          </div>
        )}
      </main>

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