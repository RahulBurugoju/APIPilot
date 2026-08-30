import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Send, Loader2, X, Copy, Check, ChevronDown, Globe } from "lucide-react";
import {
  setCurrentRequestMethod,
  setCurrentRequestUrl,
} from "../../features/request/requestSlice.js";
import {
  combineBaseUrlAndPath,
  extractEndpointPath,
} from "../../utils/urlUtils.js";

const HTTP_METHODS = [
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
  "HEAD",
  "OPTIONS",
];

const METHOD_COLORS = {
  GET: "text-[#059669] dark:text-[#00E599] bg-[#ECFDF5] dark:bg-[#062417]",
  POST: "text-[#D97706] dark:text-[#FBBF24] bg-[#FFFBEB] dark:bg-[#201806]",
  PUT: "text-[#2563EB] dark:text-[#60A5FA] bg-[#EFF6FF] dark:bg-[#0A1B36]",
  PATCH: "text-[#7C3AED] dark:text-[#A78BFA] bg-[#F5F3FF] dark:bg-[#1E1035]",
  DELETE: "text-[#DC2626] dark:text-[#F87171] bg-[#FEF2F2] dark:bg-[#200B0D]",
  HEAD: "text-[#4B5563] dark:text-[#9CA3AF] bg-[#F3F4F6] dark:bg-[#1F2937]",
  OPTIONS: "text-[#4B5563] dark:text-[#9CA3AF] bg-[#F3F4F6] dark:bg-[#1F2937]",
};

function RequestHeader({
  method: propMethod,
  url: propUrl,
  baseUrl = "",
  onMethodChange,
  onUrlChange,
  onSend,
  isSending = false,
  disabled = false,
}) {
  const dispatch = useDispatch();
  const currentRequest = useSelector((state) => state.request.currentRequest);
  const [copiedUrl, setCopiedUrl] = useState(false);

  const activeMethod = propMethod !== undefined ? propMethod : (currentRequest?.method || "GET");
  const activeUrl = propUrl !== undefined ? propUrl : (currentRequest?.url || "");

  const handleMethodChange = (e) => {
    const newMethod = e.target.value;
    dispatch(setCurrentRequestMethod(newMethod));
    if (onMethodChange) {
      onMethodChange(newMethod);
    }
  };

  const handleUrlChange = (e) => {
    let newUrl = e.target.value;
    if (baseUrl) {
      newUrl = extractEndpointPath(newUrl, baseUrl);
    }
    dispatch(setCurrentRequestUrl(newUrl));
    if (onUrlChange) {
      onUrlChange(newUrl);
    }
  };

  const handleClearUrl = () => {
    dispatch(setCurrentRequestUrl(""));
    if (onUrlChange) {
      onUrlChange("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && onSend && !isSending && !disabled) {
      e.preventDefault();
      onSend();
    }
  };

  const combinedUrl = baseUrl ? combineBaseUrlAndPath(baseUrl, activeUrl) : activeUrl;

  const handleCopyCombined = () => {
    if (!combinedUrl) return;
    navigator.clipboard.writeText(combinedUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  return (
    <div className="w-full space-y-1.5">
      <div className="flex items-center gap-2 w-full">
        {/* 1. Method Selector with Color-Coded Badge & Custom Arrow */}
        <div className="relative shrink-0">
          <select
            value={activeMethod}
            onChange={handleMethodChange}
            disabled={disabled}
            className={`appearance-none pl-3 pr-7 py-2 rounded-lg border border-[#E6D2A5] dark:border-[#2C2C2E] text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#FF6D1F]/20 focus:border-[#FF6D1F] cursor-pointer shadow-xs transition-all ${
              METHOD_COLORS[activeMethod] || "text-[#FF6D1F] bg-[#FAF3E1] dark:bg-[#1C1C1F]"
            }`}
            aria-label="HTTP Method"
          >
            {HTTP_METHODS.map((m) => (
              <option
                key={m}
                value={m}
                className="font-mono font-bold text-[#222222] dark:text-[#F5F5F7] bg-[#FFFFFF] dark:bg-[#141416]"
              >
                {m}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-60 text-current" />
        </div>

        {/* 2. URL Endpoint Input with Base URL Prefix */}
        <div className="flex-1 flex items-center rounded-lg bg-[#FFFFFF] dark:bg-[#141416] border border-[#E6D2A5] dark:border-[#2C2C2E] focus-within:border-[#FF6D1F] focus-within:ring-2 focus-within:ring-[#FF6D1F]/20 shadow-xs transition-all overflow-hidden h-9">
          {baseUrl ? (
            <div
              className="flex items-center gap-1.5 px-3 h-full bg-[#FAF3E1]/70 dark:bg-[#1C1C1F] border-r border-[#E6D2A5] dark:border-[#2C2C2E] text-xs font-mono font-medium text-[#5C5C5C] dark:text-[#A1A1A6] select-none shrink-0 max-w-[200px] sm:max-w-[280px]"
              title={`Collection Base URL: ${baseUrl}`}
            >
              <Globe className="w-3 h-3 text-[#FF6D1F] shrink-0" />
              <span className="truncate text-[#222222] dark:text-[#F5F5F7]">
                {baseUrl}
              </span>
            </div>
          ) : null}

          <input
            type="text"
            value={activeUrl}
            onChange={handleUrlChange}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder={baseUrl ? "/endpoint (e.g. /users or /login)" : "https://api.example.com/endpoint"}
            className="flex-1 px-3 py-1.5 bg-transparent text-xs font-mono text-[#222222] dark:text-[#F5F5F7] placeholder-[#8C8C8C] dark:placeholder-[#6E6E73] focus:outline-none"
            aria-label="Request URL Endpoint"
          />

          {/* Quick Clear URL Button */}
          {activeUrl && !disabled && (
            <button
              type="button"
              onClick={handleClearUrl}
              className="p-1 mr-2 text-[#8C8C8C] hover:text-[#222222] dark:hover:text-[#F5F5F7] rounded cursor-pointer transition-colors"
              title="Clear URL"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* 3. Send Action Button */}
        <button
          type="button"
          onClick={onSend}
          disabled={disabled || isSending}
          className="group relative flex items-center justify-center gap-2 px-5 py-2 h-9 rounded-lg bg-gradient-to-r from-[#FF6D1F] to-[#FF8D4D] hover:from-[#E85B0F] hover:to-[#FF6D1F] active:scale-[0.98] text-white text-xs font-semibold tracking-wide transition-all shadow-sm hover:shadow cursor-pointer shrink-0 disabled:opacity-50 disabled:cursor-not-allowed select-none"
        >
          {isSending ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Sending...</span>
            </>
          ) : (
            <>
              <Send className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              <span>Send</span>
              <kbd className="hidden sm:inline-flex text-[9px] font-mono px-1 py-0.2 rounded bg-black/20 text-white/90 border border-white/20">
                ↵
              </kbd>
            </>
          )}
        </button>
      </div>

      {/* 4. Combined URL Preview pill */}
      {baseUrl && (
        <div className="flex items-center justify-between text-[11px] font-mono text-[#8C8C8C] dark:text-[#6E6E73] px-1">
          <div className="flex items-center gap-1.5 truncate">
            <span className="text-[#8C8C8C] dark:text-[#6E6E73]">Target:</span>
            <span className="text-[#FF6D1F] font-medium truncate">
              {combinedUrl || `${baseUrl}/`}
            </span>
          </div>

          <button
            type="button"
            onClick={handleCopyCombined}
            className="inline-flex items-center gap-1 text-[10px] text-[#8C8C8C] hover:text-[#222222] dark:hover:text-[#F5F5F7] transition-colors ml-2 shrink-0 cursor-pointer"
            title="Copy full URL"
          >
            {copiedUrl ? (
              <>
                <Check className="w-3 h-3 text-[#059669] dark:text-[#00E599]" />
                <span className="text-[#059669] dark:text-[#00E599]">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copy URL</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

export default RequestHeader;