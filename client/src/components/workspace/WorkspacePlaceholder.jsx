import React from "react";
import { Folder, Send, Sliders, Sparkles } from "lucide-react";

const icons = {
  collections: Folder,
  requests: Send,
  environments: Sliders,
  default: Sparkles,
};

function WorkspacePlaceholder({
  title,
  description = "This feature is currently under active development. You will soon be able to configure and execute requests seamlessly here.",
  type = "default",
  actionText,
  onAction,
}) {
  const Icon = icons[type] || icons.default;

  return (
    <div className="p-8 rounded-lg bg-[#FFFFFF] dark:bg-[#141416] border border-[#E6D2A5] dark:border-[#2C2C2E] text-center space-y-3 shadow-xs">
      <div className="w-10 h-10 rounded-full bg-[#FAF3E1] dark:bg-[#1C1C1F] border border-[#E6D2A5] dark:border-[#2C2C2E] flex items-center justify-center mx-auto text-[#FF6D1F]">
        <Icon className="w-5 h-5" />
      </div>

      <div>
        <h3 className="text-sm font-semibold text-[#222222] dark:text-[#F5F5F7]">
          {title}
        </h3>
        <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-[#FAF3E1] dark:bg-[#1C1C1F] border border-[#E6D2A5] dark:border-[#2C2C2E] text-[10px] font-mono font-medium text-[#FF6D1F]">
          Coming soon
        </span>
      </div>

      <p className="text-xs text-[#5C5C5C] dark:text-[#A1A1A6] max-w-md mx-auto leading-relaxed">
        {description}
      </p>

      {actionText && (
        <div className="pt-2">
          <button
            type="button"
            onClick={onAction}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-[#FF6D1F] text-white hover:bg-[#E85B0F] text-xs font-medium transition-colors shadow-sm cursor-pointer"
          >
            {actionText}
          </button>
        </div>
      )}
    </div>
  );
}

export default WorkspacePlaceholder;
