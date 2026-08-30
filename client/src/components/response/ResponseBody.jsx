import { useState, useMemo } from "react";
import {
  formatResponseBody,
  isJsonContentType,
  detectContentType,
} from "../../utils/formatResponse";

/**
 * Renders a string with search-matched segments highlighted.
 */
function HighlightedText({ text, query }) {
  if (!query || !query.trim()) {
    return <>{text}</>;
  }

  const parts = [];
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  let lastIndex = 0;

  let idx = lowerText.indexOf(lowerQuery, lastIndex);
  while (idx !== -1) {
    if (idx > lastIndex) {
      parts.push(
        <span key={`t-${lastIndex}`}>
          {text.substring(lastIndex, idx)}
        </span>
      );
    }
    parts.push(
      <mark
        key={`h-${idx}`}
        className="bg-[#FBBF24]/30 dark:bg-[#FBBF24]/20 text-[#222222] dark:text-[#F5F5F7] rounded-sm px-0.5"
      >
        {text.substring(idx, idx + query.length)}
      </mark>
    );
    lastIndex = idx + query.length;
    idx = lowerText.indexOf(lowerQuery, lastIndex);
  }

  if (lastIndex < text.length) {
    parts.push(
      <span key={`t-${lastIndex}`}>
        {text.substring(lastIndex)}
      </span>
    );
  }

  return <>{parts}</>;
}

export default function ResponseBody({
  data,
  contentType = "",
  searchQuery = "",
}) {
  const [viewMode, setViewMode] = useState("pretty"); // "pretty" | "raw"

  const category = detectContentType(contentType);
  const isJson = category === "json" || typeof data === "object";

  const formattedBody = useMemo(() => {
    const pretty = viewMode === "pretty";
    return formatResponseBody(data, { pretty, contentType });
  }, [data, viewMode, contentType]);

  // Filter + highlight when searching
  const displayLines = useMemo(() => {
    if (!formattedBody) return [];
    return formattedBody.split("\n");
  }, [formattedBody]);

  const filteredLines = useMemo(() => {
    if (!searchQuery.trim()) return displayLines;
    const q = searchQuery.toLowerCase();
    const matched = displayLines.filter((line) =>
      line.toLowerCase().includes(q)
    );
    return matched.length > 0 ? matched : null;
  }, [displayLines, searchQuery]);

  // Content type label
  const typeLabel = category === "json"
    ? "JSON"
    : category === "xml"
      ? "XML"
      : category === "html"
        ? "HTML"
        : "Text";

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* View Mode Toggle + Content Type Badge */}
      <div className="flex items-center gap-2 px-3 py-1.5 border-b border-[#FAF3E1] dark:border-[#1F1F23] bg-[#FAF3E1]/30 dark:bg-[#121214] shrink-0">
        {/* Pretty / Raw toggle — only meaningful for JSON */}
        {isJson && (
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

        {/* Content type label badge */}
        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-[#FAF3E1] dark:bg-[#1C1C1F] border border-[#E6D2A5]/50 dark:border-[#2C2C2E] text-[#8C8C8C] dark:text-[#A1A1A6]">
          {typeLabel}
        </span>

        {/* Line count */}
        {displayLines.length > 0 && (
          <span className="text-[10px] font-mono text-[#8C8C8C] dark:text-[#6E6E73] ml-auto">
            {searchQuery && filteredLines
              ? `${filteredLines.length} / ${displayLines.length} lines`
              : `${displayLines.length} lines`}
          </span>
        )}
      </div>

      {/* Body Content */}
      <div className="flex-1 overflow-auto">
        {filteredLines === null ? (
          <div className="p-4 text-center">
            <p className="text-xs font-mono text-[#8C8C8C] dark:text-[#6E6E73]">
              No matching lines found for &ldquo;{searchQuery}&rdquo;
            </p>
          </div>
        ) : filteredLines.length === 0 ? (
          <pre className="text-xs font-mono text-[#8C8C8C] dark:text-[#6E6E73] leading-relaxed p-4 select-text italic">
            (Empty response body)
          </pre>
        ) : (
          <pre className="text-xs font-mono text-[#222222] dark:text-[#F5F5F7] leading-relaxed p-4 select-text flex-1">
            {searchQuery.trim()
              ? filteredLines.map((line, i) => (
                  <div key={i}>
                    <HighlightedText text={line} query={searchQuery} />
                    {"\n"}
                  </div>
                ))
              : formattedBody}
          </pre>
        )}
      </div>
    </div>
  );
}
