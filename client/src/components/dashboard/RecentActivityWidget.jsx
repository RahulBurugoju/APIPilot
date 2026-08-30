import React from "react";
import { Clock, ArrowUpRight, CheckCircle2, AlertCircle, History, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";

const METHOD_COLORS = {
  GET: "text-[#059669] bg-[#ECFDF5] dark:bg-[#062417] dark:text-[#00E599]",
  POST: "text-[#D97706] bg-[#FEF3C7] dark:bg-[#271E05] dark:text-[#FBBF24]",
  PUT: "text-[#2563EB] bg-[#EFF6FF] dark:bg-[#0A192F] dark:text-[#60A5FA]",
  PATCH: "text-[#7C3AED] bg-[#F5F3FF] dark:bg-[#1E1035] dark:text-[#A78BFA]",
  DELETE: "text-[#DC2626] bg-[#FEE2E2] dark:bg-[#2A1517] dark:text-[#F87171]",
};

function formatRelativeTime(isoDateStr) {
  if (!isoDateStr) return "";
  try {
    const date = new Date(isoDateStr);
    const now = new Date();
    const diffSec = Math.floor((now - date) / 1000);
    if (diffSec < 10) return "just now";
    if (diffSec < 60) return `${diffSec}s ago`;
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) return `${diffHour}h ago`;
    const diffDay = Math.floor(diffHour / 24);
    return `${diffDay}d ago`;
  } catch {
    return "";
  }
}

export default function RecentActivityWidget({ history = [], projects = [] }) {
  const navigate = useNavigate();
  const recentItems = history.slice(0, 6);

  if (recentItems.length === 0) {
    return (
      <div className="p-5 rounded-lg bg-[#FFFFFF] dark:bg-[#141416] border border-[#E6D2A5] dark:border-[#2C2C2E] text-center space-y-2">
        <div className="w-8 h-8 rounded-full bg-[#FAF3E1] dark:bg-[#1C1C1F] border border-[#E6D2A5] dark:border-[#2C2C2E] flex items-center justify-center mx-auto text-[#FF6D1F]">
          <History className="w-4 h-4" />
        </div>
        <p className="text-xs font-semibold text-[#222222] dark:text-[#F5F5F7]">
          No recent executions
        </p>
        <p className="text-[11px] text-[#8C8C8C] dark:text-[#6E6E73]">
          Execute requests in any project to track execution activity here.
        </p>
      </div>
    );
  }

  return (
    <div className="p-5 rounded-lg bg-[#FFFFFF] dark:bg-[#141416] border border-[#E6D2A5] dark:border-[#2C2C2E] space-y-4 shadow-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-[#FF6D1F]" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#222222] dark:text-[#F5F5F7]">
            Recent Activity
          </h3>
        </div>
        <span className="text-[10px] font-mono text-[#8C8C8C] dark:text-[#6E6E73]">
          Last {recentItems.length} calls
        </span>
      </div>

      <div className="space-y-2">
        {recentItems.map((item) => {
          const method = item.method || item.requestSnapshot?.method || "GET";
          const status = item.status || item.responseSnapshot?.status || 200;
          const isSuccess = status >= 200 && status < 300;
          const urlStr = item.url || item.requestSnapshot?.url || "/";
          const nameStr = item.name || item.requestSnapshot?.name || urlStr;
          const duration = item.duration || item.time || item.responseSnapshot?.duration;
          const timeAgo = formatRelativeTime(item.createdAt || item.timestamp);

          return (
            <div
              key={item._id || item.id || Math.random()}
              className="group flex items-center justify-between p-2.5 rounded-md bg-[#FAF3E1]/40 dark:bg-[#1C1C1F]/60 border border-[#E6D2A5]/50 dark:border-[#2C2C2E] hover:border-[#FF6D1F]/50 transition-colors text-xs cursor-pointer"
              onClick={() => {
                const targetProject = projects.find(
                  (p) => String(p._id) === String(item.projectId)
                );
                if (targetProject) {
                  navigate(`/projects/${targetProject._id}`);
                } else if (projects.length > 0) {
                  navigate(`/projects/${projects[0]._id}`);
                }
              }}
            >
              <div className="flex items-center gap-2 min-w-0 flex-1 pr-2">
                <span
                  className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold shrink-0 ${
                    METHOD_COLORS[method] || METHOD_COLORS.GET
                  }`}
                >
                  {method}
                </span>

                <span
                  className="font-medium text-[#222222] dark:text-[#F5F5F7] truncate max-w-[160px] sm:max-w-[220px]"
                  title={nameStr}
                >
                  {nameStr}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0 font-mono text-[10px]">
                <span
                  className={`px-1.5 py-0.2 rounded font-bold ${
                    isSuccess
                      ? "text-[#059669] dark:text-[#00E599] bg-[#ECFDF5] dark:bg-[#062417]"
                      : "text-[#DC2626] dark:text-[#F87171] bg-[#FEF2F2] dark:bg-[#200B0D]"
                  }`}
                >
                  {status}
                </span>

                {duration !== undefined && (
                  <span className="text-[#8C8C8C] dark:text-[#6E6E73]">
                    {duration}ms
                  </span>
                )}

                {timeAgo && (
                  <span className="text-[#8C8C8C] dark:text-[#6E6E73] text-[9px]">
                    {timeAgo}
                  </span>
                )}

                <ArrowUpRight className="w-3 h-3 text-[#8C8C8C] group-hover:text-[#FF6D1F] transition-colors" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
