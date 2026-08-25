import React from "react";
import { useSelector } from "react-redux";
import ProjectCard from "./ProjectCard";
import { FolderOpen, AlertCircle, Loader2 } from "lucide-react";

const ProjectList = () => {
  const { projects = [], loading, error } = useSelector((state) => state.project);

  // Loading Skeleton State
  if (loading && (!projects || projects.length === 0)) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-5 w-32 bg-[#E6D2A5]/50 dark:bg-[#1C1C1F] rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="p-5 rounded-lg bg-[#FFFFFF] dark:bg-[#141416] border border-[#E6D2A5] dark:border-[#2C2C2E] space-y-3 animate-pulse"
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

  // Empty State
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
          Create your first API project above to begin testing and inspecting endpoints.
        </p>
      </div>
    );
  }

  // Projects Grid
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-[#222222] dark:text-[#F5F5F7]">
            Your Collections
          </h2>
          <span className="px-2 py-0.5 rounded-full bg-[#FAF3E1] dark:bg-[#1C1C1F] border border-[#E6D2A5] dark:border-[#2C2C2E] text-[10px] font-mono text-[#5C5C5C] dark:text-[#A1A1A6]">
            {projects.length} {projects.length === 1 ? "project" : "projects"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <ProjectCard key={project._id || project.id} project={project} />
        ))}
      </div>
    </div>
  );
};

export default ProjectList;