import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  History,
  Trash2,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Clock,
  Zap,
  AlertCircle,
  CheckCircle2,
  XCircle,
  FileCode,
} from "lucide-react";
import {
  fetchRequestHistory,
  fetchExecution,
  deleteExecution,
  clearHistory,
} from "../../features/requestHistory/requestHistory.thunk.js";

const METHOD_BADGES = {
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
      text: "ERR",
      className:
        "text-[#DC2626] dark:text-[#F87171] bg-[#FEF2F2] dark:bg-[#200B0D] border-[#FECACA] dark:border-[#4B141A]",
    };
  }
  if (status >= 200 && status < 300) {
    return {
      text: `${status}`,
      className:
        "text-[#059669] dark:text-[#00E599] bg-[#ECFDF5] dark:bg-[#062417] border-[#A7F3D0] dark:border-[#104D30]",
    };
  }
  if (status >= 300 && status < 400) {
    return {
      text: `${status}`,
      className:
        "text-[#2563EB] dark:text-[#60A5FA] bg-[#EFF6FF] dark:bg-[#0A1B36] border-[#BFDBFE] dark:border-[#1E3A8A]",
    };
  }
  if (status >= 400 && status < 500) {
    return {
      text: `${status}`,
      className:
        "text-[#D97706] dark:text-[#FBBF24] bg-[#FFFBEB] dark:bg-[#201806] border-[#FDE68A] dark:border-[#523B0F]",
    };
  }
  return {
    text: `${status}`,
    className:
      "text-[#DC2626] dark:text-[#F87171] bg-[#FEF2F2] dark:bg-[#200B0D] border-[#FECACA] dark:border-[#4B141A]",
  };
}

function formatTime(isoString) {
  if (!isoString) return "";
  try {
    const d = new Date(isoString);
    return d.toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return "";
  }
}

export default function RequestHistory({
  projectId,
  requestId,
  onSelectExecution,
}) {
  const dispatch = useDispatch();
  const {
    executions = [],
    currentExecution = null,
    pagination = { page: 1, limit: 20, total: 0, totalPages: 0 },
    loading = false,
    error = null,
  } = useSelector((state) => state.requestHistory || {});

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  useEffect(() => {
    if (projectId && requestId) {
      dispatch(fetchRequestHistory({ projectId, requestId, page, limit }));
    }
  }, [dispatch, projectId, requestId, page, limit]);

  const handleRefresh = () => {
    if (projectId && requestId) {
      dispatch(fetchRequestHistory({ projectId, requestId, page, limit }));
    }
  };

  const handleClearAll = () => {
    if (!projectId || !requestId) return;
    if (window.confirm("Are you sure you want to clear all history for this request?")) {
      dispatch(clearHistory({ projectId, requestId }));
    }
  };

  const handleDeleteItem = (e, executionId) => {
    e.stopPropagation();
    if (!projectId || !requestId || !executionId) return;
    dispatch(deleteExecution({ projectId, requestId, executionId }));
  };

  const handleRowClick = (exec) => {
    dispatch(
      fetchExecution({
        projectId,
        requestId,
        executionId: exec._id || exec.id,
      })
    );
    if (onSelectExecution) {
      onSelectExecution(exec);
    }
  };

  return (
    <div className="w-full flex flex-col h-full bg-[#FFFFFF] dark:bg-[#141416] border border-[#E6D2A5] dark:border-[#2C2C2E] rounded-xl overflow-hidden shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#FAF3E1]/60 dark:bg-[#101012] border-b border-[#E6D2A5] dark:border-[#2C2C2E]">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-[#FF6D1F]" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#222222] dark:text-[#F5F5F7]">
            History
          </h3>
          {pagination?.total > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-[#FF6D1F]/10 text-[#FF6D1F] text-[10px] font-mono font-bold">
              {pagination.total}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={loading}
            className="p-1.5 rounded-md hover:bg-[#FAF3E1] dark:hover:bg-[#1C1C1F] text-[#5C5C5C] dark:text-[#A1A1A6] transition-colors cursor-pointer disabled:opacity-50"
            title="Refresh history"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          </button>
          {executions.length > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium text-[#DC2626] dark:text-[#F87171] hover:bg-[#FEF2F2] dark:hover:bg-[#200B0D] transition-colors cursor-pointer"
              title="Clear request history"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="m-3 p-2.5 rounded-lg bg-[#FEF2F2] dark:bg-[#200B0D] border border-[#FECACA] dark:border-[#4B141A] flex items-center gap-2 text-xs text-[#DC2626] dark:text-[#F87171]">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span className="truncate">{error}</span>
        </div>
      )}

      {/* Execution List */}
      <div className="flex-1 overflow-y-auto divide-y divide-[#E6D2A5]/50 dark:divide-[#2C2C2E]/50">
        {loading && executions.length === 0 ? (
          <div className="p-8 text-center text-xs font-mono text-[#8C8C8C] dark:text-[#6E6E73]">
            Loading execution history...
          </div>
        ) : executions.length === 0 ? (
          <div className="p-8 text-center space-y-2">
            <Clock className="w-8 h-8 text-[#8C8C8C] dark:text-[#6E6E73] mx-auto opacity-50" />
            <p className="text-xs font-medium text-[#222222] dark:text-[#F5F5F7]">
              No executions yet
            </p>
            <p className="text-[11px] text-[#8C8C8C] dark:text-[#6E6E73]">
              Send a request to automatically record execution history.
            </p>
          </div>
        ) : (
          executions.map((exec) => {
            const execId = exec._id || exec.id;
            const isSelected =
              currentExecution &&
              (currentExecution._id || currentExecution.id) === execId;
            const method =
              exec.requestSnapshot?.method ||
              exec.request?.method ||
              "GET";
            const url =
              exec.requestSnapshot?.url ||
              exec.request?.url ||
              "";
            const status = exec.response?.status ?? (exec.success ? 200 : 0);
            const duration = exec.response?.duration ?? 0;
            const timeStr = formatTime(exec.createdAt);
            const badge = getStatusBadge(status);

            return (
              <div
                key={execId}
                onClick={() => handleRowClick(exec)}
                className={`group flex items-center justify-between px-4 py-2.5 hover:bg-[#FAF3E1]/40 dark:hover:bg-[#1C1C1F]/60 transition-colors cursor-pointer select-none ${
                  isSelected ? "bg-[#FAF3E1] dark:bg-[#1C1C1F] font-medium" : ""
                }`}
              >
                {/* Left side: Status, Method, Path */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {/* Status Badge */}
                  <span
                    className={`px-2 py-0.5 rounded-md text-[11px] font-mono font-bold border shrink-0 ${badge.className}`}
                  >
                    {badge.text}
                  </span>

                  {/* Method Badge */}
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border shrink-0 ${
                      METHOD_BADGES[method] || "text-[#FF6D1F]"
                    }`}
                  >
                    {method}
                  </span>

                  {/* URL Path */}
                  <span
                    className="text-xs font-mono text-[#222222] dark:text-[#F5F5F7] truncate"
                    title={url}
                  >
                    {url || "/"}
                  </span>
                </div>

                {/* Right side: Duration, Timestamp, Delete */}
                <div className="flex items-center gap-3 shrink-0 ml-3 text-[11px] font-mono text-[#8C8C8C] dark:text-[#6E6E73]">
                  {duration > 0 && (
                    <span className="flex items-center gap-1">
                      <Zap className="w-3 h-3 text-[#FF6D1F]" />
                      {duration}ms
                    </span>
                  )}
                  <span>{timeStr}</span>

                  <button
                    type="button"
                    onClick={(e) => handleDeleteItem(e, execId)}
                    className="p-1 rounded-md opacity-0 group-hover:opacity-100 hover:bg-[#FEF2F2] dark:hover:bg-[#200B0D] text-[#8C8C8C] hover:text-[#DC2626] dark:hover:text-[#F87171] transition-all cursor-pointer"
                    title="Delete history entry"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination Footer */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#FAF3E1]/60 dark:bg-[#101012] border-t border-[#E6D2A5] dark:border-[#2C2C2E] text-xs font-mono text-[#5C5C5C] dark:text-[#A1A1A6]">
          <span>
            Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={pagination.page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="p-1 rounded-md border border-[#E6D2A5] dark:border-[#2C2C2E] hover:bg-[#FAF3E1] dark:hover:bg-[#1C1C1F] disabled:opacity-40 cursor-pointer transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="p-1 rounded-md border border-[#E6D2A5] dark:border-[#2C2C2E] hover:bg-[#FAF3E1] dark:hover:bg-[#1C1C1F] disabled:opacity-40 cursor-pointer transition-colors"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
