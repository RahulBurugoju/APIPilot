import React, { useState } from "react";
import {
  ArrowLeft,
  Zap,
  Globe,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Play,
  Copy,
  Check,
  FileCode,
  Sliders,
  HardDrive,
  Calendar,
} from "lucide-react";
import ResponseViewer from "../response/ResponseViewer";

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
      text: "0 Network Error",
      className:
        "text-[#DC2626] dark:text-[#F87171] bg-[#FEF2F2] dark:bg-[#200B0D] border-[#FECACA] dark:border-[#4B141A]",
    };
  }
  if (status >= 200 && status < 300) {
    return {
      text: `${status} OK`,
      className:
        "text-[#059669] dark:text-[#00E599] bg-[#ECFDF5] dark:bg-[#062417] border-[#A7F3D0] dark:border-[#104D30]",
    };
  }
  if (status >= 300 && status < 400) {
    return {
      text: `${status} Redirect`,
      className:
        "text-[#2563EB] dark:text-[#60A5FA] bg-[#EFF6FF] dark:bg-[#0A1B36] border-[#BFDBFE] dark:border-[#1E3A8A]",
    };
  }
  if (status >= 400 && status < 500) {
    return {
      text: `${status} Client Error`,
      className:
        "text-[#D97706] dark:text-[#FBBF24] bg-[#FFFBEB] dark:bg-[#201806] border-[#FDE68A] dark:border-[#523B0F]",
    };
  }
  return {
    text: `${status} Server Error`,
    className:
      "text-[#DC2626] dark:text-[#F87171] bg-[#FEF2F2] dark:bg-[#200B0D] border-[#FECACA] dark:border-[#4B141A]",
  };
}

function formatBytes(bytes) {
  if (!bytes || bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

function formatDate(isoString) {
  if (!isoString) return "";
  try {
    const d = new Date(isoString);
    return d.toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  } catch {
    return isoString;
  }
}

export default function RequestHistoryViewer({
  execution,
  project,
  onBack,
  onLoadIntoEditor,
  onRunAgain,
  onClearHistory,
}) {
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [activeViewTab, setActiveViewTab] = useState("response"); // 'response' | 'snapshot'
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  if (!execution) {
    return (
      <div className="p-8 text-center space-y-4">
        <p className="text-sm font-medium text-[#8C8C8C]">No execution history item selected.</p>
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 rounded-lg bg-[#FF6D1F] text-white text-xs font-semibold hover:bg-[#E85B0F] transition-colors cursor-pointer"
          >
            Return to Request Center
          </button>
        )}
      </div>
    );
  }

  const snapshot = execution.requestSnapshot || execution.request || {};
  const responseData = execution.response || null;

  const method = snapshot.method || execution.method || "GET";
  const url = snapshot.url || execution.url || "";
  const status = responseData?.status ?? (execution.success ? 200 : 0);
  const duration = responseData?.duration ?? execution.duration ?? 0;
  const size = responseData?.size ?? execution.size ?? 0;
  const createdAt = execution.createdAt || execution.timestamp;
  const statusBadge = getStatusBadge(status);
  const isSuccess = execution.success ?? (status >= 200 && status < 400);

  const handleCopyUrl = () => {
    if (!url) return;
    navigator.clipboard.writeText(url);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleLoadRequest = () => {
    if (onLoadIntoEditor) {
      onLoadIntoEditor({
        _id: execution.request?._id || execution.request || snapshot._id,
        name: snapshot.name || execution.name || "Executed Request",
        method,
        url,
        headers: snapshot.headers || [],
        queryParams: snapshot.queryParams || [],
        body: snapshot.body || { type: "none", content: null },
        auth: snapshot.auth || { type: "none" },
      });
    }
  };

  const handleRunAgainClick = () => {
    if (onRunAgain) {
      onRunAgain();
    } else if (onLoadIntoEditor) {
      handleLoadRequest();
    }
  };

  const handleConfirmClear = () => {
    setShowClearConfirm(false);
    if (onClearHistory) {
      onClearHistory();
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#FAF3E1]/30 dark:bg-[#101012] overflow-hidden relative">
      {/* Top Header */}
      <div className="p-4 bg-[#FFFFFF] dark:bg-[#141416] border-b border-[#E6D2A5] dark:border-[#2C2C2E] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAF3E1] dark:bg-[#1C1C1F] hover:bg-[#F5E7C6] dark:hover:bg-[#2C2C2E] text-[#222222] dark:text-[#F5F5F7] border border-[#E6D2A5] dark:border-[#2C2C2E] text-xs font-semibold transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#FF6D1F]" />
              <span>Back to Request Center</span>
            </button>
          )}

          <h2 className="text-sm font-bold text-[#222222] dark:text-[#F5F5F7]">
            Execution Details
          </h2>
        </div>

        {/* Header Action Buttons: Run Again & Clear History */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRunAgainClick}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#FF6D1F] hover:bg-[#E85B0F] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            title="Execute current request with latest URL, headers & environment"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Run Again</span>
          </button>

          {onClearHistory && (
            <button
              type="button"
              onClick={() => setShowClearConfirm(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAF3E1] dark:bg-[#1C1C1F] hover:bg-[#FEF2F2] dark:hover:bg-[#200B0D] text-[#DC2626] dark:text-[#F87171] border border-[#E6D2A5] dark:border-[#2C2C2E] text-xs font-semibold transition-colors cursor-pointer"
            >
              <span>Clear History</span>
            </button>
          )}
        </div>
      </div>

      {/* Confirmation Modal for Clear History */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-[#FFFFFF] dark:bg-[#141416] border border-[#E6D2A5] dark:border-[#2C2C2E] rounded-xl p-5 max-w-sm w-full shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-[#222222] dark:text-[#F5F5F7]">
              Clear all request history?
            </h3>
            <p className="text-xs text-[#8C8C8C] dark:text-[#6E6E73]">
              This cannot be undone. All execution history records for this request will be permanently removed.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="px-3.5 py-1.5 rounded-lg border border-[#E6D2A5] dark:border-[#2C2C2E] text-xs font-medium text-[#222222] dark:text-[#F5F5F7] hover:bg-[#FAF3E1] dark:hover:bg-[#1C1C1F] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmClear}
                className="px-3.5 py-1.5 rounded-lg bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs"
              >
                Clear History
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Execution Overview Grid */}
      <div className="p-4 bg-[#FFFFFF]/90 dark:bg-[#141416]/90 border-b border-[#E6D2A5] dark:border-[#2C2C2E] shrink-0">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono">
          {/* Request Block */}
          <div className="space-y-1.5 md:col-span-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#8C8C8C] dark:text-[#6E6E73]">
              Request
            </div>
            <div className="border-b border-[#E6D2A5] dark:border-[#2C2C2E] pb-1.5" />
            <div className="flex items-center gap-2 min-w-0 pt-0.5">
              <span
                className={`px-2 py-0.5 rounded-md text-xs font-mono font-bold border shrink-0 ${
                  METHOD_BADGES[method] || "text-[#FF6D1F]"
                }`}
              >
                {method}
              </span>
              <span
                className="font-semibold text-[#222222] dark:text-[#F5F5F7] truncate"
                title={url}
              >
                {url}
              </span>
              <button
                type="button"
                onClick={handleCopyUrl}
                className="p-1 hover:bg-[#FAF3E1] dark:hover:bg-[#1C1C1F] rounded text-[#8C8C8C] hover:text-[#222222] dark:hover:text-[#F5F5F7] transition-colors cursor-pointer shrink-0"
                title="Copy Executed URL"
              >
                {copiedUrl ? (
                  <Check className="w-3.5 h-3.5 text-[#059669] dark:text-[#00E599]" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* Response Block */}
          <div className="space-y-1.5">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#8C8C8C] dark:text-[#6E6E73]">
              Response
            </div>
            <div className="border-b border-[#E6D2A5] dark:border-[#2C2C2E] pb-1.5" />
            <div className="flex items-center gap-2 pt-0.5">
              <span
                className={`px-2.5 py-0.5 rounded-md text-xs font-mono font-bold border ${statusBadge.className}`}
              >
                {statusBadge.text}
              </span>
            </div>
          </div>

          {/* Duration & Size Block */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#8C8C8C] dark:text-[#6E6E73]">
                Duration
              </div>
              <div className="border-b border-[#E6D2A5] dark:border-[#2C2C2E] pb-1.5" />
              <div className="flex items-center gap-1 text-[#FF6D1F] font-bold pt-0.5">
                <Zap className="w-3.5 h-3.5" />
                <span>{duration} ms</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#8C8C8C] dark:text-[#6E6E73]">
                Size
              </div>
              <div className="border-b border-[#E6D2A5] dark:border-[#2C2C2E] pb-1.5" />
              <div className="flex items-center gap-1 text-[#222222] dark:text-[#F5F5F7] font-semibold pt-0.5">
                <HardDrive className="w-3.5 h-3.5 text-[#8C8C8C]" />
                <span>{formatBytes(size)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Execution Error Banner (if any) */}
        {!isSuccess && (execution.error || status === 0) && (
          <div className="mt-3 p-2.5 rounded-lg bg-[#FEF2F2] dark:bg-[#200B0D] border border-[#FECACA] dark:border-[#4B141A] flex items-center gap-2 text-xs font-mono text-[#DC2626] dark:text-[#F87171]">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="font-bold">Error:</span>
            <span>{execution.error || "The request did not return a valid response payload."}</span>
          </div>
        )}
      </div>

      {/* Tabs Switcher: Response Output vs Request Snapshot */}
      <div className="flex items-center justify-between border-b border-[#E6D2A5] dark:border-[#2C2C2E] bg-[#FAF3E1]/60 dark:bg-[#101012] px-4 shrink-0">
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => setActiveViewTab("response")}
            className={`px-4 py-2 text-xs font-bold font-mono border-b-2 transition-colors cursor-pointer ${
              activeViewTab === "response"
                ? "border-[#FF6D1F] text-[#FF6D1F]"
                : "border-transparent text-[#5C5C5C] dark:text-[#A1A1A6] hover:text-[#222222] dark:hover:text-[#F5F5F7]"
            }`}
          >
            Response Presentation (Body & Headers)
          </button>
          <button
            type="button"
            onClick={() => setActiveViewTab("snapshot")}
            className={`px-4 py-2 text-xs font-bold font-mono border-b-2 transition-colors cursor-pointer ${
              activeViewTab === "snapshot"
                ? "border-[#FF6D1F] text-[#FF6D1F]"
                : "border-transparent text-[#5C5C5C] dark:text-[#A1A1A6] hover:text-[#222222] dark:hover:text-[#F5F5F7]"
            }`}
          >
            Request Snapshot
          </button>
        </div>

        {createdAt && (
          <span className="text-[11px] font-mono text-[#8C8C8C] dark:text-[#6E6E73] flex items-center gap-1 hidden sm:flex">
            <Calendar className="w-3 h-3" />
            {formatDate(createdAt)}
          </span>
        )}
      </div>

      {/* Response Presentation Body & Headers / Snapshot Details */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeViewTab === "response" && (
          <div className="h-full flex flex-col">
            {responseData ? (
              <ResponseViewer
                response={{
                  status: responseData.status,
                  statusText: responseData.statusText,
                  headers: responseData.headers,
                  data: responseData.data,
                  duration: responseData.duration || duration,
                  size: responseData.size || size,
                  contentType: responseData.contentType || "",
                }}
                loading={false}
              />
            ) : (
              <div className="p-8 text-center space-y-2 text-[#8C8C8C]">
                <AlertCircle className="w-8 h-8 mx-auto text-[#DC2626] opacity-60" />
                <p className="text-xs font-semibold text-[#222222] dark:text-[#F5F5F7]">
                  No Response Captured
                </p>
                <p className="text-[11px]">
                  {execution.error || "The request did not return a response payload."}
                </p>
              </div>
            )}
          </div>
        )}

        {activeViewTab === "snapshot" && (
          <div className="space-y-4 max-w-4xl">
            {/* Headers Snapshot */}
            <div className="p-4 rounded-xl bg-[#FFFFFF] dark:bg-[#141416] border border-[#E6D2A5] dark:border-[#2C2C2E] space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#222222] dark:text-[#F5F5F7] flex items-center gap-2">
                <Sliders className="w-3.5 h-3.5 text-[#FF6D1F]" />
                <span>Request Headers</span>
              </h4>
              {snapshot.headers && snapshot.headers.length > 0 ? (
                <div className="divide-y divide-[#E6D2A5]/40 dark:divide-[#2C2C2E]/40 font-mono text-xs">
                  {snapshot.headers.map((h, idx) => (
                    <div key={idx} className="py-1.5 flex items-center justify-between">
                      <span className="font-semibold text-[#222222] dark:text-[#F5F5F7]">{h.key}</span>
                      <span className="text-[#8C8C8C] dark:text-[#A1A1A6]">{h.value}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#8C8C8C] italic">No headers defined.</p>
              )}
            </div>

            {/* Query Params Snapshot */}
            <div className="p-4 rounded-xl bg-[#FFFFFF] dark:bg-[#141416] border border-[#E6D2A5] dark:border-[#2C2C2E] space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#222222] dark:text-[#F5F5F7] flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-[#FF6D1F]" />
                <span>Query Parameters</span>
              </h4>
              {snapshot.queryParams && snapshot.queryParams.length > 0 ? (
                <div className="divide-y divide-[#E6D2A5]/40 dark:divide-[#2C2C2E]/40 font-mono text-xs">
                  {snapshot.queryParams.map((q, idx) => (
                    <div key={idx} className="py-1.5 flex items-center justify-between">
                      <span className="font-semibold text-[#222222] dark:text-[#F5F5F7]">{q.key}</span>
                      <span className="text-[#8C8C8C] dark:text-[#A1A1A6]">{q.value}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#8C8C8C] italic">No query parameters defined.</p>
              )}
            </div>

            {/* Body Snapshot */}
            <div className="p-4 rounded-xl bg-[#FFFFFF] dark:bg-[#141416] border border-[#E6D2A5] dark:border-[#2C2C2E] space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#222222] dark:text-[#F5F5F7] flex items-center gap-2">
                <FileCode className="w-3.5 h-3.5 text-[#FF6D1F]" />
                <span>Request Body ({snapshot.body?.type || "none"})</span>
              </h4>
              {snapshot.body?.content ? (
                <pre className="p-3 rounded-lg bg-[#FAF3E1]/60 dark:bg-[#101012] font-mono text-xs text-[#222222] dark:text-[#F5F5F7] overflow-x-auto border border-[#E6D2A5] dark:border-[#2C2C2E]">
                  {typeof snapshot.body.content === "object"
                    ? JSON.stringify(snapshot.body.content, null, 2)
                    : snapshot.body.content}
                </pre>
              ) : (
                <p className="text-xs text-[#8C8C8C] italic">No request body content.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
