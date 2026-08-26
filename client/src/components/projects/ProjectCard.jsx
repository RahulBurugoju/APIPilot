import React from "react";
import { Folder, ArrowUpRight, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProjectCard = ({ project }) => {
    const navigate = useNavigate();

    
  const formattedDate = project.updatedAt
    ? new Date(project.updatedAt).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Recently";

  return (
    <div onClick={()=>navigate(`/projects/${project._id}`)} className="group relative flex flex-col justify-between p-5 rounded-lg bg-[#FFFFFF] dark:bg-[#141416] border border-[#E6D2A5] dark:border-[#2C2C2E] hover:border-[#FF6D1F] dark:hover:border-[#6E6E73] transition-all duration-200 shadow-xs hover:shadow-sm cursor-pointer">
      <div>
        {/* Header: Icon + Name + Arrow */}
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 shrink-0 rounded-md bg-[#FAF3E1] dark:bg-[#1C1C1F] border border-[#E6D2A5] dark:border-[#2C2C2E] flex items-center justify-center text-[#FF6D1F] dark:text-[#F5F5F7] group-hover:scale-105 transition-transform">
              <Folder className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-sm font-semibold text-[#222222] dark:text-[#F5F5F7] truncate group-hover:text-[#FF6D1F] dark:group-hover:text-white transition-colors">
              {project.name}
            </h3>
          </div>

          <ArrowUpRight className="w-4 h-4 text-[#8C8C8C] dark:text-[#6E6E73] group-hover:text-[#FF6D1F] dark:group-hover:text-[#F5F5F7] shrink-0 transition-colors" />
        </div>

        {/* Description */}
        <p className="text-xs text-[#5C5C5C] dark:text-[#A1A1A6] line-clamp-2 leading-relaxed mb-4 min-h-[32px]">
          {project.description || "No description provided."}
        </p>
      </div>

      {/* Footer Meta */}
      <div className="pt-3 border-t border-[#FAF3E1] dark:border-[#1F1F23] flex items-center justify-between text-[11px] text-[#8C8C8C] dark:text-[#6E6E73]">
        <div className="flex items-center gap-1.5 font-mono">
          <Clock className="w-3 h-3 text-[#8C8C8C] dark:text-[#6E6E73]" />
          <span>Updated {formattedDate}</span>
        </div>

        <span className="px-2 py-0.5 rounded bg-[#FAF3E1] dark:bg-[#1C1C1F] text-[#5C5C5C] dark:text-[#A1A1A6] font-mono text-[10px]">
          Active
        </span>
      </div>
    </div>
  );
};

export default ProjectCard;