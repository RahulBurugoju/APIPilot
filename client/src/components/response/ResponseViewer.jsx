import { useState } from "react";
import {
  Check,
  Copy,
  Clock,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Loader2,
  Send,
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
  if (!status) return "text-[#8C8C8C] bg-[#FAF3E1] dark:bg-[#1C1C1F] border-[#E6D2A5] dark:border-[#2C2C2E]";
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
function formatResponseBody(data) {
  if (data === undefined || data === null) return "";
  if (typeof data === "object") {
    try {
      return JSON.stringify(data, null, 2);
    } catch {
      return String(data);
    }
  }
  if (typeof data === "string") {
    try {
      // If it's a JSON string, format it nicely
      const parsed = JSON.parse(data);
      return JSON.stringify(parsed, null, 2);
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
}) {
  const [activeTab, setActiveTab] = useState("body"); // "body" | "headers"
  const [copied, setCopied] = useState(false);

  // Normalize response in case it is nested under .result or .data
  const res = response?.result || response?.data?.result || response;

  const formattedBody = res ? formatResponseBody(res.data) : "";
  const headerEntries = res?.headers ? Object.entries(res.headers) : [];

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

  return (
    <div className="rounded-lg bg-[#FFFFFF] dark:bg-[#141416] border border-[#E6D2A5] dark:border-[#2C2C2E] shadow-xs flex flex-col flex-1 min-h-[260px] overflow-hidden">
      {/* 02.10.17 — Response Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#FAF3E1] dark:border-[#1F1F23] bg-[#FAF3E1]/40 dark:bg-[#18181B]/60">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-[#222222] dark:text-[#F5F5F7]">
            Response
          </span>

          {res ? (
            <>
              {/* Status Code & Text */}
              <div
                className={`flex items-center gap-1 px-2 py-0.5 rounded border text-[10px] font-mono font-bold ${getStatusColorClass(
                  res.status
                )}`}
              >
                {res.status >= 200 && res.status < 300 ? (
                  <CheckCircle2 className="w-3 h-3" />
                ) : (
                  <AlertTriangle className="w-3 h-3" />
                )}
                <span>
                  {res.status !== undefined ? res.status : ""} {res.statusText || ""}
                </span>
              </div>

              {/* Execution Duration */}
              {res.duration !== undefined && (
                <div className="flex items-center gap-1 text-[11px] text-[#8C8C8C] dark:text-[#6E6E73] font-mono">
                  <Clock className="w-3 h-3 text-[#FF6D1F]" />
                  <span>{res.duration} ms</span>
                </div>
              )}

              {/* Response Size */}
              {res.size !== undefined && (
                <span className="text-[11px] text-[#8C8C8C] dark:text-[#6E6E73] font-mono">
                  {formatBytes(res.size)}
                </span>
              )}
            </>
          ) : null}
        </div>

        {/* 02.10.18 — Response Tabs & Copy Action */}
        <div className="flex items-center gap-2">
          {res && (
            <>
              <div className="flex items-center rounded bg-[#FAF3E1] dark:bg-[#1C1C1F] p-0.5 border border-[#E6D2A5] dark:border-[#2C2C2E]">
                <button
                  type="button"
                  onClick={() => setActiveTab("body")}
                  className={`px-3 py-0.5 text-[11px] font-medium rounded transition-colors cursor-pointer ${
                    activeTab === "body"
                      ? "bg-white dark:bg-[#2C2C2E] text-[#FF6D1F] shadow-xs"
                      : "text-[#5C5C5C] dark:text-[#A1A1A6] hover:text-[#222222] dark:hover:text-[#F5F5F7]"
                  }`}
                >
                  Body
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("headers")}
                  className={`px-3 py-0.5 text-[11px] font-medium rounded transition-colors cursor-pointer ${
                    activeTab === "headers"
                      ? "bg-white dark:bg-[#2C2C2E] text-[#FF6D1F] shadow-xs"
                      : "text-[#5C5C5C] dark:text-[#A1A1A6] hover:text-[#222222] dark:hover:text-[#F5F5F7]"
                  }`}
                >
                  Headers ({headerEntries.length})
                </button>
              </div>

              {/* Copy Button */}
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white dark:bg-[#1C1C1F] border border-[#E6D2A5] dark:border-[#2C2C2E] hover:bg-[#FAF3E1] dark:hover:bg-[#26262A] text-[11px] font-mono text-[#5C5C5C] dark:text-[#A1A1A6] hover:text-[#222222] dark:hover:text-[#F5F5F7] transition-colors cursor-pointer shadow-xs"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-[#FF6D1F]" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Response Content View */}
      <div className="flex-1 overflow-auto bg-[#FAF3E1]/20 dark:bg-[#0B0B0D]/60 flex flex-col">
        {loading ? (
          /* Loading State */
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <Loader2 className="w-6 h-6 animate-spin text-[#FF6D1F] mb-3" />
            <p className="text-xs font-mono font-medium text-[#222222] dark:text-[#F5F5F7]">
              Sending request...
            </p>
            {endpoint && (
              <p className="text-[11px] font-mono text-[#8C8C8C] dark:text-[#6E6E73] mt-1 truncate max-w-[420px]">
                {endpoint}
              </p>
            )}
          </div>
        ) : error && !res ? (
          /* Error State */
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <AlertCircle className="w-8 h-8 text-[#DC2626] dark:text-[#F87171] mb-2" />
            <p className="text-xs font-semibold text-[#DC2626] dark:text-[#F87171]">
              Could not get any response
            </p>
            <p className="text-[11px] font-mono text-[#8C8C8C] dark:text-[#6E6E73] mt-1 max-w-[480px]">
              {error}
            </p>
          </div>
        ) : res ? (
          activeTab === "headers" ? (
            /* 02.10.20 — Response Headers Table */
            <div className="p-3">
              {headerEntries.length === 0 ? (
                <p className="text-xs font-mono text-[#8C8C8C] dark:text-[#6E6E73] p-4 text-center">
                  No response headers received.
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
                    {headerEntries.map(([key, val]) => (
                      <tr
                        key={key}
                        className="border-b border-[#FAF3E1] dark:border-[#1F1F23] hover:bg-[#FAF3E1]/40 dark:hover:bg-[#141416]"
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
            /* 02.10.19 — Response Body Formatted View */
            <pre className="text-xs font-mono text-[#222222] dark:text-[#F5F5F7] leading-relaxed overflow-x-auto p-4 select-text">
              {formattedBody || "(Empty response body)"}
            </pre>
          )
        ) : (
          /* Empty State */
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-[#8C8C8C] dark:text-[#6E6E73]">
            <Send className="w-7 h-7 text-[#FF6D1F]/40 mb-2" />
            <p className="text-xs font-medium text-[#5C5C5C] dark:text-[#A1A1A6]">
              Ready to test
            </p>
            <p className="text-[11px] text-[#8C8C8C] dark:text-[#6E6E73] mt-0.5">
              Click <span className="font-semibold text-[#FF6D1F]">Send</span> to execute this request against the server
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResponseViewer;
