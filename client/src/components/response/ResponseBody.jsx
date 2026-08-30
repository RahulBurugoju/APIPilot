import { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import { formatResponseBody } from "./responseUtils";

export default function ResponseBody({
  data,
  searchQuery = "",
}) {
  const [viewMode, setViewMode] = useState("pretty"); // "pretty" | "raw"

  const isPretty = viewMode === "pretty";
  const formattedBody = formatResponseBody(data, isPretty);

  const filteredBody = useMemo(() => {
    if (!searchQuery.trim() || !formattedBody) return formattedBody;
    const lines = formattedBody.split("\n");
    const matched = lines.filter((l) =>
      l.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return matched.length > 0 ? matched.join("\n") : "(No matching lines found)";
  }, [formattedBody, searchQuery]);

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* View Mode Toggle */}
      <div className="flex items-center gap-2 px-3 py-1.5 border-b border-[#FAF3E1] dark:border-[#1F1F23] bg-[#FAF3E1]/30 dark:bg-[#121214] shrink-0">
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
      </div>

      {/* Body Content */}
      <pre className="text-xs font-mono text-[#222222] dark:text-[#F5F5F7] leading-relaxed overflow-x-auto p-4 select-text flex-1">
        {filteredBody || "(Empty response body)"}
      </pre>
    </div>
  );
}
