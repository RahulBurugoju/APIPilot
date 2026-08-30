import { useState, useMemo } from "react";
import {
  Check,
  Copy,
  AlertCircle,
  Send,
  Trash2,
  Search,
  X,
  ServerOff,
} from "lucide-react";

import ResponseHeader from "./ResponseHeader";
import ResponseTabs from "./ResponseTabs";
import ResponseBody from "./ResponseBody";
import ResponseHeaders from "./ResponseHeaders";
import ResponseCookies from "./ResponseCookies";
import ResponseInfo from "./ResponseInfo";
import { formatResponseBody } from "./responseUtils";

/**
 * Count cookies from response headers.
 */
function countCookies(headers = {}) {
  const key = Object.keys(headers).find(
    (k) => k.toLowerCase() === "set-cookie"
  );
  if (!key) return 0;
  const val = headers[key];
  if (Array.isArray(val)) return val.length;
  return String(val).split(/,(?=\s*\w+=)/).length;
}

function ResponseViewer({
  response = null,
  loading = false,
  error = null,
  endpoint = "",
  onClearResponse,
}) {
  const [activeTab, setActiveTab] = useState("body"); // "body" | "headers" | "cookies" | "info"
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  // Normalize response in case it is nested under .result or .data
  const res = response?.result || response?.data?.result || response;

  const headerEntries = res?.headers ? Object.entries(res.headers) : [];
  const cookieCount = res?.headers ? countCookies(res.headers) : 0;

  const handleCopy = () => {
    if (!res) return;
    const textToCopy =
      activeTab === "headers"
        ? JSON.stringify(res.headers || {}, null, 2)
        : formatResponseBody(res.data, true);

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isOffline = res?.status === 0 || res?.data?.code === "ECONNREFUSED";

  return (
    <div className="rounded-lg bg-[#FFFFFF] dark:bg-[#141416] border border-[#E6D2A5] dark:border-[#2C2C2E] shadow-xs flex flex-col flex-1 min-h-[200px] overflow-hidden">
      {/* Response Header Bar */}
      <div className="flex items-center justify-between px-3.5 py-2 border-b border-[#FAF3E1] dark:border-[#1F1F23] bg-[#FAF3E1]/40 dark:bg-[#18181B]/60 shrink-0 flex-wrap gap-2">
        <ResponseHeader response={res} loading={loading} />

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

              {/* Tabs: Body / Headers / Cookies / Info */}
              <ResponseTabs
                activeTab={activeTab}
                onTabChange={setActiveTab}
                headerCount={headerEntries.length}
                cookieCount={cookieCount}
              />

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
            <ResponseHeaders
              headers={res.headers}
              searchQuery={searchQuery}
            />
          ) : activeTab === "cookies" ? (
            <ResponseCookies headers={res.headers} />
          ) : activeTab === "info" ? (
            <ResponseInfo response={res} />
          ) : (
            <ResponseBody
              data={res.data}
              searchQuery={searchQuery}
            />
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
