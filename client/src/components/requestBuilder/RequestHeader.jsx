import { useDispatch, useSelector } from "react-redux";
import { Send, Loader2 } from "lucide-react";
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
  GET: "text-[#059669] dark:text-[#00E599]",
  POST: "text-[#D97706] dark:text-[#FBBF24]",
  PUT: "text-[#2563EB] dark:text-[#60A5FA]",
  PATCH: "text-[#7C3AED] dark:text-[#A78BFA]",
  DELETE: "text-[#DC2626] dark:text-[#F87171]",
  HEAD: "text-[#4B5563] dark:text-[#9CA3AF]",
  OPTIONS: "text-[#4B5563] dark:text-[#9CA3AF]",
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

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && onSend && !isSending && !disabled) {
      e.preventDefault();
      onSend();
    }
  };

  const combinedUrl = baseUrl ? combineBaseUrlAndPath(baseUrl, activeUrl) : activeUrl;

  return (
    <div className="w-full space-y-1.5">
      <div className="flex items-center gap-2 w-full">
        {/* 1. Method Selector */}
        <div className="relative shrink-0">
          <select
            value={activeMethod}
            onChange={handleMethodChange}
            disabled={disabled}
            className={`px-3 py-2 rounded-md bg-[#FFFFFF] dark:bg-[#141416] border border-[#E6D2A5] dark:border-[#2C2C2E] text-xs font-mono font-bold focus:outline-none focus:ring-1 focus:ring-[#FF6D1F] cursor-pointer shadow-xs transition-colors ${
              METHOD_COLORS[activeMethod] || "text-[#FF6D1F]"
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
        </div>

        {/* 2. URL Endpoint Input with Base URL Prefix */}
        <div className="flex-1 flex items-center rounded-md bg-[#FFFFFF] dark:bg-[#141416] border border-[#E6D2A5] dark:border-[#2C2C2E] focus-within:border-[#FF6D1F] focus-within:ring-1 focus-within:ring-[#FF6D1F] shadow-xs transition-colors overflow-hidden">
          {baseUrl ? (
            <div
              className="flex items-center gap-1.5 px-3 py-2 bg-[#FAF3E1]/70 dark:bg-[#1C1C1F] border-r border-[#E6D2A5] dark:border-[#2C2C2E] text-xs font-mono font-medium text-[#5C5C5C] dark:text-[#A1A1A6] select-none shrink-0"
              title={`Collection Base URL: ${baseUrl}`}
            >
              <span className="text-[9px] uppercase font-bold px-1 py-0.2 rounded bg-[#FAF3E1] dark:bg-[#2C2C2E] text-[#FF6D1F] border border-[#E6D2A5]/60 dark:border-[#3C3C3E]">
                BASE
              </span>
              <span className="truncate max-w-[160px] sm:max-w-[220px] text-[#222222] dark:text-[#F5F5F7]">
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
            placeholder={baseUrl ? "/login or /users" : "https://api.example.com/users"}
            className="flex-1 px-3.5 py-2 bg-transparent text-xs font-mono text-[#222222] dark:text-[#F5F5F7] placeholder-[#8C8C8C] dark:placeholder-[#6E6E73] focus:outline-none"
            aria-label="Request URL Endpoint"
          />
        </div>

        {/* 3. Send Action Button */}
        <button
          type="button"
          onClick={onSend}
          disabled={disabled || isSending}
          className="flex items-center gap-1.5 px-5 py-2 rounded-md bg-[#FF6D1F] hover:bg-[#E85B0F] active:scale-[0.99] text-white text-xs font-medium transition-all shadow-sm cursor-pointer shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSending ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Sending...</span>
            </>
          ) : (
            <>
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </>
          )}
        </button>
      </div>

      {/* 4. Combined URL Preview pill */}
      {baseUrl && (
        <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#8C8C8C] dark:text-[#6E6E73] px-1">
          <span>Combined:</span>
          <span className="text-[#FF6D1F] dark:text-[#FF6D1F] font-medium truncate">
            {combinedUrl || `${baseUrl}/`}
          </span>
        </div>
      )}
    </div>
  );
}

export default RequestHeader;