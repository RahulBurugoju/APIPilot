import { useState } from "react";
import { SlidersHorizontal, FileText, Code2, Shield } from "lucide-react";

const TABS = [
  { id: "params", label: "Params", icon: SlidersHorizontal },
  { id: "headers", label: "Headers", icon: FileText },
  { id: "body", label: "Body", icon: Code2 },
  { id: "auth", label: "Auth", icon: Shield },
];

function RequestTabs({ activeTab: controlledTab, onTabChange, counts = {} }) {
  // Local UI state for active tab - no Redux needed
  const [activeTab, setActiveTab] = useState("params");

  // Support both standalone local state and parent-controlled mode
  const currentTab = controlledTab !== undefined ? controlledTab : activeTab;

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    if (onTabChange) {
      onTabChange(tabId);
    }
  };

  const getBadge = (tabId) => {
    if (tabId === "params" && counts.params > 0) {
      return `(${counts.params})`;
    }
    if (tabId === "headers" && counts.headers > 0) {
      return `(${counts.headers})`;
    }
    if (tabId === "body" && counts.bodyType && counts.bodyType !== "none") {
      return `(${counts.bodyType})`;
    }
    if (tabId === "auth" && counts.authType && counts.authType !== "none") {
      return `(${counts.authType})`;
    }
    return null;
  };

  return (
    <div
      className="flex items-center gap-1 px-3 border-b border-[#FAF3E1] dark:border-[#1F1F23] text-xs font-medium overflow-x-auto bg-[#FFFFFF] dark:bg-[#141416] select-none"
      role="tablist"
      aria-label="Request Configuration Tabs"
    >
      {TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentTab === tab.id;
        const badge = getBadge(tab.id);

        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => handleTabClick(tab.id)}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 border-b-2 transition-all cursor-pointer whitespace-nowrap text-xs font-medium ${
              isActive
                ? "border-[#FF6D1F] text-[#FF6D1F] font-semibold"
                : "border-transparent text-[#8C8C8C] dark:text-[#6E6E73] hover:text-[#222222] dark:hover:text-[#F5F5F7] hover:border-[#E6D2A5]/50 dark:hover:border-[#2C2C2E]"
            }`}
          >
            <Icon className="w-3.5 h-3.5 shrink-0" />
            <span>{tab.label}</span>
            {badge && (
              <span
                className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                  isActive
                    ? "bg-[#FF6D1F]/10 text-[#FF6D1F]"
                    : "bg-[#FAF3E1] dark:bg-[#1C1C1F] text-[#5C5C5C] dark:text-[#A1A1A6]"
                }`}
              >
                {badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default RequestTabs;