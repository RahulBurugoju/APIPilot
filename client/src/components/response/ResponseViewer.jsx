import { useState, useMemo } from "react";
import {
  Check,
  Copy,
  Clock,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Loader2,
  Send,
  Trash2,
  Search,
  X,
  ServerOff,
} from "lucide-react";

/**
 * Format bytes into human readable format (B, KB, MB)
 */
function formatBytes(bytes) {
  if (!bytes || bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

/**
 * Get color classes for HTTP status code badges
 */
function getStatusColorClass(status) {
  if (!status || status === 0) {
    return "text-[#DC2626] dark:text-[#F87171] bg-[#FEF2F2] dark:bg-[#200B0D] border-[#FECACA] dark:border-[#7F1D1D]";
  }
  if (status >= 200 && status < 300) {
    return "text-[#059669] dark:text-[#00E599] bg-[#ECFDF5] dark:bg-[#062417] border-[#A7F3D0] dark:border-[#104D30]";
  }
  if (status >= 300 && status < 400) {
    return "text-[#2563EB] dark:text-[#60A5FA] bg-[#EFF6FF] dark:bg-[#0A1B36] border-[#BFDBFE] dark:border-[#1E3A8A]";
  }
  if (status >= 400 && status < 500) {
    return "text-[#D97706] dark:text-[#FBBF24] bg-[#FFFBEB] dark:bg-[#201806] border-[#FDE68A] dark:border-[#78350F]";
  }
  return "text-[#DC2626] dark:text-[#F87171] bg-[#FEF2F2] dark:bg-[#200B0D] border-[#FECACA] dark:border-[#7F1D1D]";
}

/**
 * Formats response body data into displayable string
 */
function formatResponseBody(data, isPretty = true) {
  if (data === undefined || data === null) return "";
  if (typeof data === "object") {
    try {
      return JSON.stringify(data, null, isPretty ? 2 : 0);
    } catch {
      return String(data);
    }
  }
  if (typeof data === "string") {
    try {
      const parsed = JSON.parse(data);
      return JSON.stringify(parsed, null, isPretty ? 2 : 0);
    } catch {
      return data;
    }
  }
  return String(data);
}

function ResponseViewer({
  response = null,
  loading = false,
  error = null,
  endpoint = "",
  onClearResponse,
}) {
  const [activeTab, setActiveTab] = useState("body"); // "body" | "headers"
  const [viewMode, setViewMode] = useState("pretty"); // "pretty" | "raw"
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  // Normalize response in case it is nested under .result or .data
  const res = response?.result || response?.data?.result || response;

  const isPretty = viewMode === "pretty";
  const formattedBody = res ? formatResponseBody(res.data, isPretty) : "";
  const headerEntries = res?.headers ? Object.entries(res.headers) : [];

  // Filtered headers based on search query
  const filteredHeaders = useMemo(() => {
    if (!searchQuery.trim()) return headerEntries;
    const q = searchQuery.toLowerCase();
    return headerEntries.filter(
      ([k, v]) => k.toLowerCase().includes(q) || String(v).toLowerCase().includes(q)
    );
  }, [headerEntries, searchQuery]);

  // Filtered body lines based on search query
  const filteredBody = useMemo(() => {
    if (!searchQuery.trim() || !formattedBody) return formattedBody;
    const lines = formattedBody.split("\n");
    const matched = lines.filter((l) =>
      l.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return matched.length > 0 ? matched.join("\n") : "(No matching lines found)";
  }, [formattedBody, searchQuery]);

  const handleCopy = () => {
    if (!res) return;
    const textToCopy =
      activeTab === "headers"
        ? JSON.stringify(res.headers || {}, null, 2)
        : formattedBody;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isOffline = res?.status === 0 || res?.data?.code === "ECONNREFUSED";

  return (
    <div className="rounded-lg bg-[#FFFFFF] dark:bg-[#141416] border border-[#E6D2A5] dark:border-[#2C2C2E] shadow-xs flex flex-col flex-1 min-h-[200px] overflow-hidden">
      {/* Response Header Bar */}
      <div className="flex items-center justify-between px-3.5 py-2 border-b border-[#FAF3E1] dark:border-[#1F1F23] bg-[#FAF3E1]/40 dark:bg-[#18181B]/60 shrink-0 flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-semibold text-[#222222] dark:text-[#F5F5F7]">
            Response
          </span>

          {loading && (
            <span className="flex items-center gap-1.5 text-[11px] font-mono text-[#FF6D1F] animate-pulse">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>Executing...</span>
            </span>
          )}

          {res && !loading ? (
            <>
              {/* Status Code & Text Badge */}
              <div
                className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[11px] font-mono font-bold ${getStatusColorClass(
                  res.status
                )}`}
              >
                {res.status >= 200 && res.status < 300 ? (
                  <CheckCircle2 className="w-3 h-3" />
                ) : res.status === 0 ? (
                  <ServerOff className="w-3 h-3" />
                ) : (
                  <AlertTriangle className="w-3 h-3" />
                )}
                <span>
                  {res.status !== undefined ? res.status : ""}{" "}
                  {res.status === 0 ? "Connection Refused" : res.statusText || ""}
                </span>
              </div>

              {/* Execution Duration */}
              {res.duration !== undefined && (
                <div
                  className="flex items-center gap-1 text-[11px] text-[#8C8C8C] dark:text-[#6E6E73] font-mono"
                  title="Execution Duration"
                >
                  <Clock className="w-3 h-3 text-[#FF6D1F]" />
                  <span>{res.duration} ms</span>
                </div>
              )}

              {/* Response Size */}
              {res.size !== undefined && res.size > 0 && (
                <span
                  className="text-[11px] text-[#8C8C8C] dark:text-[#6E6E73] font-mono"
                  title="Response Size"
                >
                  {formatBytes(res.size)}
                </span>
              )}
            </>
          ) : null}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          {res && !loading && (
            <>
              {/* Search Toggle */}
              <button
                type="button"
                onClick={() => {
                  setShowSearch(!showSearch);
                  if (showSearch) setSearchQuery("");
                }}
                className={`p-1 rounded-md text-xs transition-colors cursor-pointer ${
                  showSearch
                    ? "bg-[#FF6D1F]/15 text-[#FF6D1F]"
                    : "text-[#8C8C8C] hover:text-[#222222] dark:hover:text-[#F5F5F7] hover:bg-[#FAF3E1] dark:hover:bg-[#1C1C1F]"
                }`}
                title="Search response"
              >
                <Search className="w-3.5 h-3.5" />
              </button>

              {/* Tabs: Body / Headers */}
              <div className="flex items-center rounded-lg bg-[#FAF3E1] dark:bg-[#1C1C1F] p-0.5 border border-[#E6D2A5]/70 dark:border-[#2C2C2E]">
                <button
                  type="button"
                  onClick={() => setActiveTab("body")}
                  className={`px-2.5 py-0.5 text-[11px] font-medium rounded transition-colors cursor-pointer ${
                    activeTab === "body"
                      ? "bg-white dark:bg-[#2C2C2E] text-[#FF6D1F] shadow-xs font-semibold"
                      : "text-[#5C5C5C] dark:text-[#A1A1A6] hover:text-[#222222] dark:hover:text-[#F5F5F7]"
                  }`}
                >
                  Body
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("headers")}
                  className={`px-2.5 py-0.5 text-[11px] font-medium rounded transition-colors cursor-pointer ${
                    activeTab === "headers"
                      ? "bg-white dark:bg-[#2C2C2E] text-[#FF6D1F] shadow-xs font-semibold"
                      : "text-[#5C5C5C] dark:text-[#A1A1A6] hover:text-[#222222] dark:hover:text-[#F5F5F7]"
                  }`}
                >
                  Headers ({headerEntries.length})
                </button>
              </div>

              {/* Pretty / Raw Toggle (when on Body tab) */}
              {activeTab === "body" && (
                <div className="flex items-center rounded-lg bg-[#FAF3E1] dark:bg-[#1C1C1F] p-0.5 border border-[#E6D2A5]/70 dark:border-[#2C2C2E]">
                  <button
                    type="button"
                    onClick={() => setViewMode("pretty")}
                    className={`px-2 py-0.5 text-[10px] font-mono font-medium rounded transition-colors cursor-pointer ${
                      viewMode === "pretty"
                        ? "bg-white dark:bg-[#2C2C2E] text-[#FF6D1F] shadow-xs"
                        : "text-[#8C8C8C] hover:text-[#222222] dark:hover:text-[#F5F5F7]"
                    }`}
                  >
                    Pretty
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("raw")}
                    className={`px-2 py-0.5 text-[10px] font-mono font-medium rounded transition-colors cursor-pointer ${
                      viewMode === "raw"
                        ? "bg-white dark:bg-[#2C2C2E] text-[#FF6D1F] shadow-xs"
                        : "text-[#8C8C8C] hover:text-[#222222] dark:hover:text-[#F5F5F7]"
                    }`}
                  >
                    Raw
                  </button>
                </div>
              )}

              {/* Copy Button */}
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white dark:bg-[#1C1C1F] border border-[#E6D2A5] dark:border-[#2C2C2E] hover:bg-[#FAF3E1] dark:hover:bg-[#26262A] text-[11px] font-mono text-[#5C5C5C] dark:text-[#A1A1A6] hover:text-[#222222] dark:hover:text-[#F5F5F7] transition-colors cursor-pointer shadow-xs"
                title="Copy response"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-[#059669] dark:text-[#00E599]" />
                    <span className="text-[#059669] dark:text-[#00E599]">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>

              {/* Clear Response Button */}
              {onClearResponse && (
                <button
                  type="button"
                  onClick={onClearResponse}
                  className="p-1 text-[#8C8C8C] hover:text-[#DC2626] dark:hover:text-[#F87171] rounded-md transition-colors cursor-pointer hover:bg-[#FEE2E2]/60 dark:hover:bg-[#200B0D]"
                  title="Clear response"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Response Search Filter Bar (collapsible) */}
      {showSearch && res && (
        <div className="flex items-center gap-2 px-3 py-1.5 border-b border-[#FAF3E1] dark:border-[#1F1F23] bg-[#FAF3E1]/30 dark:bg-[#121214]">
          <Search className="w-3.5 h-3.5 text-[#8C8C8C]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search response content..."
            className="flex-1 bg-transparent text-xs font-mono text-[#222222] dark:text-[#F5F5F7] placeholder-[#8C8C8C] focus:outline-none"
            autoFocus
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="text-[#8C8C8C] hover:text-[#222222] dark:hover:text-[#F5F5F7]"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      )}

      {/* Response Content Area */}
      <div className="flex-1 overflow-auto bg-[#FAF3E1]/15 dark:bg-[#0B0B0D]/70 flex flex-col">
        {loading ? (
          /* Loading State */
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="relative mb-3">
              <div className="w-10 h-10 rounded-full border-2 border-[#FF6D1F]/20 border-t-[#FF6D1F] animate-spin" />
            </div>
            <p className="text-xs font-mono font-semibold text-[#222222] dark:text-[#F5F5F7]">
              Executing Request...
            </p>
            {endpoint && (
              <p className="text-[11px] font-mono text-[#8C8C8C] dark:text-[#6E6E73] mt-1 truncate max-w-[440px]">
                {endpoint}
              </p>
            )}
          </div>
        ) : error && !res ? (
          /* Error State */
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-10 h-10 rounded-full bg-[#FEE2E2] dark:bg-[#200B0D] border border-[#FECACA] dark:border-[#7F1D1D] flex items-center justify-center text-[#DC2626] dark:text-[#F87171] mb-2.5">
              <AlertCircle className="w-5 h-5" />
            </div>
            <p className="text-xs font-semibold text-[#DC2626] dark:text-[#F87171]">
              Could not get any response
            </p>
            <p className="text-[11px] font-mono text-[#8C8C8C] dark:text-[#6E6E73] mt-1.5 max-w-[480px] leading-relaxed">
              {error}
            </p>
          </div>
        ) : res ? (
          isOffline ? (
            /* Target Host Offline Diagnostic Card */
            <div className="p-5 flex-1 flex flex-col items-center justify-center text-center">
              <div className="w-11 h-11 rounded-full bg-[#FEE2E2] dark:bg-[#200B0D] border border-[#FECACA] dark:border-[#7F1D1D] flex items-center justify-center text-[#DC2626] dark:text-[#F87171] mb-3">
                <ServerOff className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-semibold text-[#222222] dark:text-[#F5F5F7]">
                Target Server Unreachable (ECONNREFUSED)
              </h4>
              <p className="text-[11px] text-[#8C8C8C] dark:text-[#6E6E73] mt-1 max-w-[420px] leading-relaxed">
                APIPilot could not establish a connection to the target server at{" "}
                <code className="text-[#FF6D1F] font-mono">
                  {res.request?.url || endpoint || "the specified URL"}
                </code>
                .
              </p>
              <div className="mt-4 p-3 rounded-lg bg-[#FFFFFF] dark:bg-[#141416] border border-[#E6D2A5] dark:border-[#2C2C2E] text-left text-[11px] font-mono space-y-1 max-w-md w-full">
                <p className="text-[#5C5C5C] dark:text-[#A1A1A6] font-semibold">
                  Troubleshooting Tips:
                </p>
                <p className="text-[#8C8C8C] dark:text-[#6E6E73]">
                  • Check if your API backend is started and listening on the expected port.
                </p>
                <p className="text-[#8C8C8C] dark:text-[#6E6E73]">
                  • Verify the target port in your collection Base URL or request endpoint.
                </p>
                <p className="text-[#8C8C8C] dark:text-[#6E6E73]">
                  • For local services, check firewall or localhost resolution settings.
                </p>
              </div>
            </div>
          ) : activeTab === "headers" ? (
            /* Response Headers Table */
            <div className="p-3">
              {filteredHeaders.length === 0 ? (
                <p className="text-xs font-mono text-[#8C8C8C] dark:text-[#6E6E73] p-4 text-center">
                  {searchQuery
                    ? "No matching headers found."
                    : "No response headers received."}
                </p>
              ) : (
                <table className="w-full text-xs font-mono text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#E6D2A5] dark:border-[#2C2C2E] text-[#8C8C8C] dark:text-[#6E6E73]">
                      <th className="py-2 px-3 font-semibold uppercase text-[10px] tracking-wider">
                        Key
                      </th>
                      <th className="py-2 px-3 font-semibold uppercase text-[10px] tracking-wider">
                        Value
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredHeaders.map(([key, val]) => (
                      <tr
                        key={key}
                        className="border-b border-[#FAF3E1] dark:border-[#1F1F23] hover:bg-[#FAF3E1]/40 dark:hover:bg-[#141416] transition-colors"
                      >
                        <td className="py-2 px-3 font-semibold text-[#FF6D1F] align-top select-text">
                          {key}
                        </td>
                        <td className="py-2 px-3 text-[#222222] dark:text-[#F5F5F7] break-all select-text">
                          {String(val)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          ) : (
            /* Response Body Formatted / Raw View */
            <pre className="text-xs font-mono text-[#222222] dark:text-[#F5F5F7] leading-relaxed overflow-x-auto p-4 select-text flex-1">
              {filteredBody || "(Empty response body)"}
            </pre>
          )
        ) : (
          /* Empty State */
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-[#8C8C8C] dark:text-[#6E6E73]">
            <div className="w-12 h-12 rounded-full bg-[#FAF3E1] dark:bg-[#1C1C1F] border border-[#E6D2A5]/70 dark:border-[#2C2C2E] flex items-center justify-center mx-auto mb-2 text-[#FF6D1F]">
              <Send className="w-5 h-5 opacity-70" />
            </div>
            <p className="text-xs font-semibold text-[#5C5C5C] dark:text-[#A1A1A6]">
              Ready to Send
            </p>
            <p className="text-[11px] text-[#8C8C8C] dark:text-[#6E6E73] mt-0.5">
              Click <span className="font-semibold text-[#FF6D1F]">Send</span> or press{" "}
              <kbd className="px-1 py-0.5 rounded bg-[#FAF3E1] dark:bg-[#1C1C1F] border border-[#E6D2A5] dark:border-[#2C2C2E] text-[10px] font-mono">
                Enter
              </kbd>{" "}
              to test this endpoint.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResponseViewer;
