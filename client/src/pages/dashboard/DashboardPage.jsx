import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../features/auth/auth.thunk.js";
import ThemeToggle from "../../components/common/ThemeToggle.jsx";
import projectThunks from "../../features/project/project.thunk.js";
import ProjectList from "../../components/projects/ProjectList.jsx";
import DashboardStats from "../../components/dashboard/DashboardStats.jsx";
import CreateProjectModal from "../../components/projects/CreateProjectModal.jsx";
import {
  Terminal,
  Search,
  Plus,
  LogOut,
  Sparkles,
  ChevronDown,
} from "lucide-react";

export default function DashboardPage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { projects = [] } = useSelector((state) => state.project);
  const { collections = [] } = useSelector((state) => state.collection || {});
  const { environments = [] } = useSelector((state) => state.environment || {});

  const [searchQuery, setSearchQuery] = useState("");
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = useState(false);

  useEffect(() => {
    dispatch(projectThunks.getProjects());
  }, [dispatch]);

  return (
    <div className="h-screen bg-[#FAF3E1] dark:bg-[#0B0B0D] text-[#222222] dark:text-[#F5F5F7] font-sans antialiased transition-colors duration-200 flex flex-col overflow-hidden">
      {/* ---------------------------------------------------- */}
      {/* TOP BAR                                              */}
      {/* ---------------------------------------------------- */}
      <header className="sticky top-0 z-40 border-b border-[#E6D2A5] dark:border-[#1F1F23] bg-[#FAF3E1]/95 dark:bg-[#141416]/90 backdrop-blur-md transition-colors duration-200 shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#FF6D1F] text-white flex items-center justify-center font-bold text-xs shadow-xs">
              <Terminal className="w-4 h-4" />
            </div>
            <span className="text-sm font-bold tracking-tight text-[#222222] dark:text-[#F5F5F7]">
              APIPilot Workspace
            </span>
          </div>

          {/* Quick Search Bar */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8C8C8C]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects, endpoints, or base URLs..."
                className="w-full pl-9 pr-4 py-1.5 rounded-lg bg-[#FFFFFF] dark:bg-[#1C1C1F] border border-[#E6D2A5] dark:border-[#2C2C2E] text-xs font-mono text-[#222222] dark:text-[#F5F5F7] placeholder-[#8C8C8C] focus:outline-none focus:border-[#FF6D1F] transition-all"
              />
            </div>
          </div>

          {/* User Controls & Actions */}
          <div className="flex items-center gap-3 text-xs">
            <ThemeToggle />

            <div className="h-4 w-px bg-[#E6D2A5] dark:bg-[#2C2C2E]" />

            {/* User Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 pl-2 pr-1.5 py-1 rounded-full hover:bg-[#F5E7C6] dark:hover:bg-[#1C1C1F] border border-[#E6D2A5] dark:border-[#2C2C2E] transition-colors cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full bg-[#FF6D1F] text-white flex items-center justify-center font-bold text-xs">
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <span className="text-xs font-semibold text-[#222222] dark:text-[#F5F5F7] hidden sm:inline">
                  {user?.name || "Developer"}
                </span>
                <ChevronDown className="w-3 h-3 text-[#8C8C8C]" />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-lg bg-[#FFFFFF] dark:bg-[#141416] border border-[#E6D2A5] dark:border-[#2C2C2E] py-1.5 shadow-lg text-xs z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-2 border-b border-[#FAF3E1] dark:border-[#1F1F23]">
                    <p className="font-semibold text-[#222222] dark:text-[#F5F5F7] truncate">
                      {user?.name || "Developer"}
                    </p>
                    <p className="text-[11px] text-[#8C8C8C] dark:text-[#6E6E73] truncate">
                      {user?.email}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      dispatch(logoutUser());
                    }}
                    className="w-full px-3 py-1.5 flex items-center gap-2 text-[#DC2626] dark:text-[#F87171] hover:bg-[#FEF2F2] dark:hover:bg-[#200B0D] transition-colors cursor-pointer"
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
      {/* MAIN CONTENT AREA                                    */}
      {/* ---------------------------------------------------- */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 flex-1 flex flex-col overflow-hidden space-y-4">
        {/* Fixed Header Section: Welcome Banner & KPI Stats */}
        <div className="shrink-0 space-y-4">
          {/* Welcome Banner */}
          <div className="p-5 rounded-lg bg-[#FFFFFF] dark:bg-[#141416] border border-[#E6D2A5] dark:border-[#2C2C2E] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#FF6D1F]">
                <Terminal className="w-3.5 h-3.5" />
                <span>Developer Portal</span>
              </div>
              <h1 className="text-lg font-bold tracking-tight text-[#222222] dark:text-[#F5F5F7]">
                Welcome back, {user?.name || "Developer"}
              </h1>
              <p className="text-xs text-[#5C5C5C] dark:text-[#A1A1A6] max-w-xl">
                Build, execute, and monitor your API requests with dynamic variable resolution and real-time execution history.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsCreateProjectModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-[#FF6D1F] hover:bg-[#E85B0F] text-white text-xs font-semibold transition-colors shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>New Project</span>
              </button>
            </div>
          </div>

          {/* KPI Stats Cards */}
          <DashboardStats
            projectsCount={projects.length}
            collectionsCount={collections.length}
            environmentsCount={environments.length}
          />

          {/* Mobile Search Bar */}
          <div className="md:hidden">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8C8C8C]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects..."
                className="w-full pl-9 pr-4 py-2 rounded-lg bg-[#FFFFFF] dark:bg-[#1C1C1F] border border-[#E6D2A5] dark:border-[#2C2C2E] text-xs font-mono text-[#222222] dark:text-[#F5F5F7] placeholder-[#8C8C8C] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Scrollable Workspaces Section */}
        <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
          <ProjectList searchQuery={searchQuery} />
        </div>
      </main>

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={isCreateProjectModalOpen}
        onClose={() => setIsCreateProjectModalOpen(false)}
      />
    </div>
  );
}
