import React from "react";
import { Folder, FolderTree, Sliders } from "lucide-react";

export default function DashboardStats({
  projectsCount = 0,
  collectionsCount = 0,
  environmentsCount = 0,
}) {
  const statCards = [
    {
      title: "Projects",
      value: projectsCount,
      label: projectsCount === 1 ? "Active Workspace" : "Active Workspaces",
      icon: Folder,
      color: "text-[#FF6D1F] bg-[#FAF3E1] dark:bg-[#1C1C1F] border-[#E6D2A5] dark:border-[#2C2C2E]",
    },
    {
      title: "Collections",
      value: collectionsCount,
      label: "API Request Groups",
      icon: FolderTree,
      color: "text-[#059669] dark:text-[#00E599] bg-[#ECFDF5] dark:bg-[#062417] border-[#A7F3D0] dark:border-[#104D30]",
    },
    {
      title: "Environments",
      value: environmentsCount,
      label: "Configured Envs",
      icon: Sliders,
      color: "text-[#2563EB] dark:text-[#60A5FA] bg-[#EFF6FF] dark:bg-[#0A1B36] border-[#BFDBFE] dark:border-[#1E3A8A]",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {statCards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="p-4 rounded-lg bg-[#FFFFFF] dark:bg-[#141416] border border-[#E6D2A5] dark:border-[#2C2C2E] shadow-xs flex items-center justify-between transition-all hover:border-[#FF6D1F]/50 group"
          >
            <div className="space-y-1">
              <span className="text-[11px] font-medium uppercase tracking-wider text-[#8C8C8C] dark:text-[#6E6E73]">
                {card.title}
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold font-mono text-[#222222] dark:text-[#F5F5F7]">
                  {card.value}
                </span>
              </div>
              <p className="text-[10px] text-[#5C5C5C] dark:text-[#A1A1A6]">
                {card.label}
              </p>
            </div>

            <div
              className={`w-9 h-9 rounded-lg border flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${card.color}`}
            >
              <Icon className="w-4 h-4" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
