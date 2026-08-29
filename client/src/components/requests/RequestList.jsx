import React from "react";
import { Send, Plus, Trash2, ArrowRight } from "lucide-react";

/**
 * RequestList Component (Spec 02.8.15)
 * Displays list of API requests belonging to a collection or workspace view.
 */
function RequestList({
  collectionName = "",
  requests = [],
  selectedRequestId = null,
  onSelectRequest = null,
  onCreateRequestClick = null,
  onDeleteRequestClick = null,
  loading = false,
}) {
  const getMethodBadgeClass = (method) => {
    switch (method?.toUpperCase()) {
      case "GET":
        return "text-[#059669] bg-[#ECFDF5] dark:bg-[#062417] dark:text-[#00E599] border-[#A7F3D0] dark:border-[#104D30]";
      case "POST":
        return "text-[#D97706] bg-[#FEF3C7] dark:bg-[#271E05] dark:text-[#FBBF24] border-[#FDE68A] dark:border-[#453308]";
      case "PUT":
        return "text-[#2563EB] bg-[#EFF6FF] dark:bg-[#0A192F] dark:text-[#60A5FA] border-[#BFDBFE] dark:border-[#1E3A8A]";
      case "PATCH":
        return "text-[#7C3AED] bg-[#F5F3FF] dark:bg-[#1E1035] dark:text-[#A78BFA] border-[#DDD6FE] dark:border-[#3B0764]";
      case "DELETE":
        return "text-[#DC2626] bg-[#FEE2E2] dark:bg-[#2A1517] dark:text-[#F87171] border-[#FCA5A5] dark:border-[#481E24]";
      default:
        return "text-[#4B5563] bg-[#F3F4F6] dark:bg-[#1F2937] dark:text-[#9CA3AF] border-[#E5E7EB] dark:border-[#374151]";
    }
  };

  return (
    <div className="space-y-3">
      {/* Header with Collection Title & Add Action */}
      <div className="flex items-center justify-between">
        {collectionName && (
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-[#222222] dark:text-[#F5F5F7] tracking-tight">
              {collectionName}
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-[#FAF3E1] dark:bg-[#1C1C1F] border border-[#E6D2A5] dark:border-[#2C2C2E] text-[10px] font-mono font-medium text-[#FF6D1F]">
              {requests.length}
            </span>
          </div>
        )}

        {onCreateRequestClick && (
          <button
            type="button"
            onClick={onCreateRequestClick}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#FF6D1F] text-white hover:bg-[#E85B0F] text-xs font-medium transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Request</span>
          </button>
        )}
      </div>

      {/* Requests List */}
      <div className="rounded-lg bg-[#FFFFFF] dark:bg-[#141416] border border-[#E6D2A5] dark:border-[#2C2C2E] divide-y divide-[#FAF3E1] dark:divide-[#1F1F23] overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-4 space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-9 rounded bg-[#E6D2A5]/40 dark:bg-[#1C1C1F] animate-pulse"
              />
            ))}
          </div>
        ) : requests && requests.length > 0 ? (
          requests.map((req) => {
            const isSelected =
              selectedRequestId && String(selectedRequestId) === String(req._id);

            return (
              <div
                key={req._id}
                onClick={() => {
                  if (onSelectRequest) onSelectRequest(req);
                }}
                className={`group flex items-center justify-between p-3 transition-colors cursor-pointer select-none ${
                  isSelected
                    ? "bg-[#FF6D1F]/10 dark:bg-[#FF6D1F]/15 text-[#FF6D1F]"
                    : "hover:bg-[#FAF3E1]/70 dark:hover:bg-[#1C1C1F]/60 text-[#222222] dark:text-[#F5F5F7]"
                }`}
              >
                {/* Left: HTTP Method + Request Name + URL */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border shrink-0 ${getMethodBadgeClass(
                      req.method
                    )}`}
                  >
                    {req.method || "GET"}
                  </span>

                  <div className="min-w-0">
                    <p className="text-xs font-semibold truncate">{req.name}</p>
                    {req.url && (
                      <p className="text-[11px] font-mono text-[#8C8C8C] dark:text-[#6E6E73] truncate">
                        {req.url}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {onDeleteRequestClick && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteRequestClick(req);
                      }}
                      className="p-1 rounded hover:bg-red-500/20 text-[#8C8C8C] hover:text-red-500 transition-colors"
                      title="Delete Request"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <ArrowRight className="w-3.5 h-3.5 text-[#8C8C8C] group-hover:text-[#FF6D1F] transition-colors" />
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-6 text-center space-y-3">
            <div className="w-9 h-9 rounded-full bg-[#FAF3E1] dark:bg-[#1C1C1F] border border-[#E6D2A5] dark:border-[#2C2C2E] flex items-center justify-center mx-auto text-[#FF6D1F]">
              <Send className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#222222] dark:text-[#F5F5F7]">
                No requests in this collection
              </p>
              <p className="text-[11px] text-[#8C8C8C] dark:text-[#6E6E73] mt-0.5">
                Create an API request to start testing endpoints.
              </p>
            </div>
            {onCreateRequestClick && (
              <button
                type="button"
                onClick={onCreateRequestClick}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#FF6D1F] text-white hover:bg-[#E85B0F] text-xs font-medium transition-colors cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Request</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default RequestList;
