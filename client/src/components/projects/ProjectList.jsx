import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import ProjectCard from "./ProjectCard";
import { FolderOpen, AlertCircle, Search } from "lucide-react";

const ProjectList = ({ searchQuery = "" }) => {
  const { projects = [], loading, error } = useSelector((state) => state.project);

  const filteredProjects = useMemo(() => {
    if (!searchQuery.trim()) return projects;
    const q = searchQuery.toLowerCase();
    return projects.filter((p) => {
      const nameMatch = p.name?.toLowerCase().includes(q);
      const descMatch = p.description?.toLowerCase().includes(q);
      const urlMatch = p.baseUrl?.toLowerCase().includes(q);
      return nameMatch || descMatch || urlMatch;
    });
  }, [projects, searchQuery]);

  // Loading Skeleton State
  if (loading && (!projects || projects.length === 0)) {
    return (
      <div className="flex-1 flex flex-col min-h-0 space-y-3">
        <div className="flex items-center justify-between shrink-0">
          <div className="h-5 w-32 bg-[#E6D2A5]/50 dark:bg-[#1C1C1F] rounded animate-pulse" />
        </div>
        <div className="flex-1 overflow-y-auto flex flex-wrap gap-4 align-content-start pr-1">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="p-5 rounded-lg bg-[#FFFFFF] dark:bg-[#141416] border border-[#E6D2A5] dark:border-[#2C2C2E] space-y-3 animate-pulse flex-1 min-w-[260px] max-w-sm"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-md bg-[#FAF3E1] dark:bg-[#1C1C1F]" />
                <div className="h-4 w-28 bg-[#FAF3E1] dark:bg-[#1C1C1F] rounded" />
              </div>
              <div className="h-3 w-full bg-[#FAF3E1] dark:bg-[#1C1C1F] rounded" />
              <div className="h-3 w-2/3 bg-[#FAF3E1] dark:bg-[#1C1C1F] rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="p-4 rounded-lg bg-[#FEE2E2] dark:bg-[#1C1214] border border-[#FCA5A5] dark:border-[#481E24] flex items-center gap-3 text-xs text-[#DC2626] dark:text-[#F87171]">
        <AlertCircle className="w-4 h-4 shrink-0" />
        <span>{typeof error === "string" ? error : error?.message || "Failed to load projects"}</span>
      </div>
    );
  }

  // Empty Projects State
  if (!projects || projects.length === 0) {
    return (
      <div className="p-8 rounded-lg bg-[#FFFFFF] dark:bg-[#141416] border border-[#E6D2A5] dark:border-[#2C2C2E] text-center max-w-md mx-auto shadow-xs">
        <div className="w-10 h-10 rounded-full bg-[#FAF3E1] dark:bg-[#1C1C1F] border border-[#E6D2A5] dark:border-[#2C2C2E] flex items-center justify-center mx-auto mb-3 text-[#FF6D1F]">
          <FolderOpen className="w-5 h-5" />
        </div>
        <h3 className="text-sm font-semibold text-[#222222] dark:text-[#F5F5F7] mb-1">
          No projects yet
        </h3>
        <p className="text-xs text-[#5C5C5C] dark:text-[#A1A1A6]">
          Create your first API project to start building and testing endpoints.
        </p>
      </div>
    );
  }

  // Empty Filter Results State
  if (filteredProjects.length === 0) {
    return (
      <div className="p-8 rounded-lg bg-[#FFFFFF] dark:bg-[#141416] border border-[#E6D2A5] dark:border-[#2C2C2E] text-center space-y-2">
        <Search className="w-6 h-6 mx-auto text-[#8C8C8C]" />
        <p className="text-xs font-semibold text-[#222222] dark:text-[#F5F5F7]">
          No matching projects
        </p>
        <p className="text-[11px] text-[#8C8C8C] dark:text-[#6E6E73]">
          No projects match &ldquo;{searchQuery}&rdquo;. Try another search term.
        </p>
      </div>
    );
  }

  // Independently Scrollable Flex Wrap Container
  return (
    <div className="flex-1 flex flex-col min-h-0 space-y-3 overflow-hidden">
      <div className="flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-[#222222] dark:text-[#F5F5F7]">
            Your Workspaces
          </h2>
          <span className="px-2 py-0.5 rounded-full bg-[#FAF3E1] dark:bg-[#1C1C1F] border border-[#E6D2A5] dark:border-[#2C2C2E] text-[10px] font-mono text-[#5C5C5C] dark:text-[#A1A1A6]">
            {filteredProjects.length} {filteredProjects.length === 1 ? "project" : "projects"}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto flex flex-wrap gap-4 align-content-start pr-1">
        {filteredProjects.map((project) => (
          <div key={project._id || project.id} className="flex-1 min-w-[260px] max-w-sm">
            <ProjectCard project={project} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectList;