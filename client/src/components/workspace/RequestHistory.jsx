import React, { useState, useEffect, useMemo } from "react";
import {
  History,
  Clock,
  Send,
  Trash2,
  Search,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  ArrowUpRight,
  Filter,
  Layers,
} from "lucide-react";

const METHOD_COLORS = {
  GET: "text-[#059669] dark:text-[#00E599] bg-[#ECFDF5] dark:bg-[#062417] border-[#A7F3D0] dark:border-[#104D30]",
  POST: "text-[#D97706] dark:text-[#FBBF24] bg-[#FFFBEB] dark:bg-[#201806] border-[#FDE68A] dark:border-[#523B0F]",
  PUT: "text-[#2563EB] dark:text-[#60A5FA] bg-[#EFF6FF] dark:bg-[#0A1B36] border-[#BFDBFE] dark:border-[#1E3A8A]",
  PATCH: "text-[#7C3AED] dark:text-[#A78BFA] bg-[#F5F3FF] dark:bg-[#1E1035] border-[#DDD6FE] dark:border-[#3B1D70]",
  DELETE: "text-[#DC2626] dark:text-[#F87171] bg-[#FEF2F2] dark:bg-[#200B0D] border-[#FECACA] dark:border-[#4B141A]",
  HEAD: "text-[#4B5563] dark:text-[#9CA3AF] bg-[#F3F4F6] dark:bg-[#1F2937] border-[#E5E7EB] dark:border-[#374151]",
  OPTIONS: "text-[#4B5563] dark:text-[#9CA3AF] bg-[#F3F4F6] dark:bg-[#1F2937] border-[#E5E7EB] dark:border-[#374151]",
};

function getStatusBadge(status) {
  if (!status || status === 0) {
    return {
      label: "Error",
      className: "text-[#DC2626] dark:text-[#F87171] bg-[#FEF2F2] dark:bg-[#200B0D] border-[#FECACA] dark:border-[#4B141A]",
    };
  }
  if (status >= 200 && status < 300) {
    return {
      label: `${status}`,
      className: "text-[#059669] dark:text-[#00E599] bg-[#ECFDF5] dark:bg-[#062417] border-[#A7F3D0] dark:border-[#104D30]",
    };
  }
  if (status >= 300 && status < 400) {
    return {
      label: `${status}`,
      className: "text-[#2563EB] dark:text-[#60A5FA] bg-[#EFF6FF] dark:bg-[#0A1B36] border-[#BFDBFE] dark:border-[#1E3A8A]",
    };
  }
  if (status >= 400 && status < 500) {
    return {
      label: `${status}`,
      className: "text-[#D97706] dark:text-[#FBBF24] bg-[#FFFBEB] dark:bg-[#201806] border-[#FDE68A] dark:border-[#523B0F]",
    };
  }
  return {
    label: `${status}`,
    className: "text-[#DC2626] dark:text-[#F87171] bg-[#FEF2F2] dark:bg-[#200B0D] border-[#FECACA] dark:border-[#4B141A]",
  };
}

function formatBytes(bytes) {
  if (!bytes || bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

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
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

export default function RequestHistory({
  project,
  requests = [],
  onSelectRequest,
  onNewRequest,
}) {
  const projectId = project?._id;
  const [history, setHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [methodFilter, setMethodFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Load history from localStorage
  useEffect(() => {
    if (!projectId) return;
    try {
      const saved = localStorage.getItem(`apipilot_history_${projectId}`);
      if (saved) {
        setHistory(JSON.parse(saved));
      } else {
        setHistory([]);
      }
    } catch {
      setHistory([]);
    }
  }, [projectId]);

  const handleClearHistory = () => {
    if (!projectId) return;
    localStorage.removeItem(`apipilot_history_${projectId}`);
    setHistory([]);
  };

  const filteredHistory = useMemo(() => {
    return history.filter((item) => {
      // 1. Method filter
      if (methodFilter !== "ALL" && item.method !== methodFilter) {
        return false;
      }
      // 2. Status filter
      if (statusFilter === "SUCCESS") {
        if (!item.status || item.status < 200 || item.status >= 300) return false;
      } else if (statusFilter === "ERROR") {
        if (item.status && item.status >= 200 && item.status < 400) return false;
      }
      // 3. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name?.toLowerCase().includes(q);
        const matchesUrl = item.url?.toLowerCase().includes(q);
        return matchesName || matchesUrl;
      }
      return true;
    });
  }, [history, methodFilter, statusFilter, searchQuery]);

  const handleOpenItem = (item) => {
    if (!onSelectRequest) return;
    // Find matched request in project requests if available
    const matched = requests.find((r) => String(r._id) === String(item.requestId));
    if (matched) {
      onSelectRequest(matched);
    } else {
      // Pass synthetic request object to load into RequestCenter
      onSelectRequest({
        _id: item.requestId || "history_temp",
        name: item.name || "Executed Request",
        method: item.method || "GET",
        url: item.url || "",
      });
    }
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-3.5rem)] overflow-hidden bg-[#FAF3E1]/30 dark:bg-[#0B0B0D]">
      {/* ---------------------------------------------------- */}
      {/* HEADER & FILTER BAR                                  */}
      {/* ---------------------------------------------------- */}
      <div className="p-6 pb-4 border-b border-[#FAF3E1] dark:border-[#1F1F23] bg-[#FAF3E1]/60 dark:bg-[#141416]/60 backdrop-blur-xs space-y-4 shrink-0">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#FAF3E1] dark:bg-[#1C1C1F] border border-[#E6D2A5] dark:border-[#2C2C2E] flex items-center justify-center text-[#FF6D1F]">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-base font-bold text-[#222222] dark:text-[#F5F5F7]">
                Request History
              </h1>
              <p className="text-xs text-[#5C5C5C] dark:text-[#A1A1A6]">
                Inspect past executed requests, response latency, and status codes.
              </p>
            </div>
          </div>

          {history.length > 0 && (
            <button
              type="button"
              onClick={handleClearHistory}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E6D2A5] dark:border-[#2C2C2E] text-xs text-[#DC2626] dark:text-[#F87171] hover:bg-[#FEF2F2] dark:hover:bg-[#200B0D] transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8C8C8C]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by URL or request name..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#FFFFFF] dark:bg-[#1C1C1F] border border-[#E6D2A5] dark:border-[#2C2C2E] text-xs text-[#222222] dark:text-[#F5F5F7] placeholder-[#8C8C8C] dark:placeholder-[#6E6E73] focus:outline-none focus:border-[#FF6D1F]"
            />
          </div>

          {/* Method Filter */}
          <div className="flex items-center rounded-lg border border-[#E6D2A5] dark:border-[#2C2C2E] bg-[#FFFFFF] dark:bg-[#1C1C1F] p-0.5 text-xs font-medium">
            {["ALL", "GET", "POST", "PUT", "DELETE"].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMethodFilter(m)}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  methodFilter === m
                    ? "bg-[#FF6D1F] text-white font-semibold shadow-xs"
                    : "text-[#5C5C5C] dark:text-[#A1A1A6] hover:text-[#222222] dark:hover:text-[#F5F5F7]"
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="flex items-center rounded-lg border border-[#E6D2A5] dark:border-[#2C2C2E] bg-[#FFFFFF] dark:bg-[#1C1C1F] p-0.5 text-xs font-medium">
            {[
              { id: "ALL", label: "All Status" },
              { id: "SUCCESS", label: "2xx Success" },
              { id: "ERROR", label: "Errors" },
            ].map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setStatusFilter(s.id)}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  statusFilter === s.id
                    ? "bg-[#FF6D1F] text-white font-semibold shadow-xs"
                    : "text-[#5C5C5C] dark:text-[#A1A1A6] hover:text-[#222222] dark:hover:text-[#F5F5F7]"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* HISTORY ITEMS LIST                                   */}
      {/* ---------------------------------------------------- */}
      <div className="flex-1 overflow-y-auto p-6">
        {history.length === 0 ? (
          <div className="max-w-md mx-auto py-16 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#FAF3E1] dark:bg-[#1C1C1F] border border-[#E6D2A5] dark:border-[#2C2C2E] flex items-center justify-center mx-auto text-[#FF6D1F]">
              <History className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#222222] dark:text-[#F5F5F7]">
                No executions recorded yet
              </h3>
              <p className="text-xs text-[#5C5C5C] dark:text-[#A1A1A6] mt-1 leading-relaxed">
                Send requests from the Request Center to view executed endpoints, latency timings, and response status codes here.
              </p>
            </div>
            {onNewRequest && (
              <button
                type="button"
                onClick={onNewRequest}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#FF6D1F] hover:bg-[#E85B0F] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Open Request Center</span>
              </button>
            )}
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="py-12 text-center text-xs text-[#8C8C8C] dark:text-[#6E6E73]">
            No history entries match the selected filters.
          </div>
        ) : (
          <div className="space-y-2 max-w-5xl">
            {filteredHistory.map((item) => {
              const statusBadge = getStatusBadge(item.status);
              const methodColor =
                METHOD_COLORS[item.method] ||
                "text-[#FF6D1F] bg-[#FAF3E1] dark:bg-[#1C1C1F] border-[#E6D2A5] dark:border-[#2C2C2E]";

              return (
                <div
                  key={item.id}
                  onClick={() => handleOpenItem(item)}
                  className="group flex items-center justify-between gap-4 p-3.5 rounded-xl bg-[#FFFFFF] dark:bg-[#141416] border border-[#E6D2A5] dark:border-[#2C2C2E] hover:border-[#FF6D1F] dark:hover:border-[#FF6D1F] shadow-2xs hover:shadow-xs transition-all cursor-pointer"
                >
                  {/* Left: Method, URL, Request Name */}
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {/* Method Tag */}
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border shrink-0 ${methodColor}`}
                    >
                      {item.method}
                    </span>

                    {/* Status Code Badge */}
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold border shrink-0 ${statusBadge.className}`}
                    >
                      {statusBadge.label} {item.statusText}
                    </span>

                    {/* URL and Name */}
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-mono font-medium text-[#222222] dark:text-[#F5F5F7] truncate">
                        {item.url || "(No URL)"}
                      </p>
                      {item.name && item.name !== item.url && (
                        <p className="text-[11px] text-[#8C8C8C] dark:text-[#6E6E73] truncate">
                          {item.name}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right: Latency, Size, Relative Time, and Run Action */}
                  <div className="flex items-center gap-3.5 text-xs text-[#8C8C8C] dark:text-[#6E6E73] font-mono shrink-0">
                    {item.time !== undefined && item.time !== null && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#FF6D1F]" />
                        <span>{item.time} ms</span>
                      </span>
                    )}

                    {item.size ? (
                      <span className="hidden sm:inline">
                        {formatBytes(item.size)}
                      </span>
                    ) : null}

                    <span className="text-[11px] text-[#5C5C5C] dark:text-[#A1A1A6] font-sans">
                      {formatRelativeTime(item.timestamp)}
                    </span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenItem(item);
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#FAF3E1] dark:bg-[#1C1C1F] hover:bg-[#FF6D1F] hover:text-white border border-[#E6D2A5] dark:border-[#2C2C2E] text-[#222222] dark:text-[#F5F5F7] text-xs font-medium transition-colors cursor-pointer"
                      title="Open in Request Center"
                    >
                      <span>Open</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
