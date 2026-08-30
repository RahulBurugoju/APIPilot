import { useState } from "react";
import { AlignLeft, Sparkles, Check, Copy, Trash2, Code2 } from "lucide-react";

const BODY_TYPES = [
  { value: "none", label: "None" },
  { value: "json", label: "JSON" },
  { value: "text", label: "Text" },
  { value: "form-data", label: "Form Data" },
  { value: "urlencoded", label: "URL Encoded" },
];

function BodyEditor({
  body,
  bodyType: controlledType,
  bodyContent: controlledContent,
  onChange,
  onBodyTypeChange,
  onBodyContentChange,
}) {
  const activeType =
    controlledType !== undefined
      ? controlledType
      : body?.type !== undefined
      ? body.type
      : "none";

  const activeContent =
    controlledContent !== undefined
      ? controlledContent
      : body?.content !== undefined
      ? body.content
      : "";

  const [formatSuccess, setFormatSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleTypeChange = (newType) => {
    if (onBodyTypeChange) {
      onBodyTypeChange(newType);
    }
    if (onChange) {
      onChange({
        type: newType,
        content: activeContent,
      });
    }
  };

  const handleContentChange = (newContent) => {
    if (onBodyContentChange) {
      onBodyContentChange(newContent);
    }
    if (onChange) {
      onChange({
        type: activeType,
        content: newContent,
      });
    }
  };

  const handlePrettifyJSON = () => {
    try {
      if (!activeContent.trim()) return;
      const parsed = JSON.parse(activeContent);
      const formatted = JSON.stringify(parsed, null, 2);
      handleContentChange(formatted);
      setFormatSuccess(true);
      setTimeout(() => setFormatSuccess(false), 2000);
    } catch {
      // Invalid JSON: leave untouched
    }
  };

  const handleInsertSample = () => {
    const sample = JSON.stringify(
      {
        name: "Rahul",
        email: "rahul@example.com",
        role: "developer",
      },
      null,
      2
    );
    handleContentChange(sample);
  };

  const handleCopy = () => {
    if (!activeContent) return;
    navigator.clipboard.writeText(activeContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    handleContentChange("");
  };

  const lineCount = activeContent ? activeContent.split("\n").length : 0;
  const byteCount = new Blob([activeContent || ""]).size;

  return (
    <div className="space-y-3 w-full flex flex-col h-full">
      {/* Top Segmented Selector Bar & Actions */}
      <div className="flex items-center justify-between gap-3 pb-2 border-b border-[#FAF3E1] dark:border-[#1F1F23] flex-wrap">
        {/* Segmented Control Pill Group */}
        <div className="inline-flex items-center rounded-lg bg-[#FAF3E1] dark:bg-[#1C1C1F] p-0.5 border border-[#E6D2A5]/70 dark:border-[#2C2C2E] gap-0.5">
          {BODY_TYPES.map((bt) => {
            const isSelected = activeType === bt.value;
            return (
              <button
                key={bt.value}
                type="button"
                onClick={() => handleTypeChange(bt.value)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all cursor-pointer select-none ${
                  isSelected
                    ? "bg-[#FFFFFF] dark:bg-[#2C2C2E] text-[#FF6D1F] shadow-xs font-semibold"
                    : "text-[#5C5C5C] dark:text-[#A1A1A6] hover:text-[#222222] dark:hover:text-[#F5F5F7]"
                }`}
              >
                {bt.label}
              </button>
            );
          })}
        </div>

        {/* Toolbar Actions when Body is Active */}
        {activeType !== "none" && (
          <div className="flex items-center gap-1.5 flex-wrap">
            {activeType === "json" && (
              <>
                {formatSuccess && (
                  <span className="text-[11px] font-mono text-[#059669] dark:text-[#00E599] flex items-center gap-1 mr-1">
                    <Check className="w-3 h-3" /> Formatted
                  </span>
                )}
                <button
                  type="button"
                  onClick={handlePrettifyJSON}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium text-[#5C5C5C] dark:text-[#A1A1A6] hover:text-[#222222] dark:hover:text-[#F5F5F7] bg-[#FFFFFF] dark:bg-[#1C1C1F] hover:bg-[#FAF3E1] dark:hover:bg-[#2C2C2E] border border-[#E6D2A5]/70 dark:border-[#2C2C2E] transition-colors cursor-pointer shadow-2xs"
                  title="Format JSON (Indent 2 spaces)"
                >
                  <Sparkles className="w-3 h-3 text-[#FF6D1F]" />
                  <span>Prettify</span>
                </button>

                {!activeContent.trim() && (
                  <button
                    type="button"
                    onClick={handleInsertSample}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium text-[#5C5C5C] dark:text-[#A1A1A6] hover:text-[#222222] dark:hover:text-[#F5F5F7] bg-[#FFFFFF] dark:bg-[#1C1C1F] hover:bg-[#FAF3E1] dark:hover:bg-[#2C2C2E] border border-[#E6D2A5]/70 dark:border-[#2C2C2E] transition-colors cursor-pointer shadow-2xs"
                    title="Insert Sample JSON"
                  >
                    <Code2 className="w-3 h-3 text-[#2563EB] dark:text-[#60A5FA]" />
                    <span>Sample</span>
                  </button>
                )}
              </>
            )}

            {activeContent && (
              <>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium text-[#5C5C5C] dark:text-[#A1A1A6] hover:text-[#222222] dark:hover:text-[#F5F5F7] bg-[#FFFFFF] dark:bg-[#1C1C1F] hover:bg-[#FAF3E1] dark:hover:bg-[#2C2C2E] border border-[#E6D2A5]/70 dark:border-[#2C2C2E] transition-colors cursor-pointer shadow-2xs"
                  title="Copy content"
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

                <button
                  type="button"
                  onClick={handleClear}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium text-[#8C8C8C] hover:text-[#DC2626] dark:hover:text-[#F87171] hover:bg-[#FEE2E2]/60 dark:hover:bg-[#200B0D] transition-colors cursor-pointer"
                  title="Clear body"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Body Content Editor */}
      {activeType === "none" ? (
        <div className="p-8 text-center rounded-lg border border-dashed border-[#E6D2A5]/70 dark:border-[#2C2C2E] bg-[#FAF3E1]/20 dark:bg-[#141416]/30 flex-1 flex flex-col items-center justify-center min-h-[140px]">
          <div className="w-10 h-10 rounded-full bg-[#FAF3E1] dark:bg-[#1C1C1F] border border-[#E6D2A5] dark:border-[#2C2C2E] flex items-center justify-center mb-2 text-[#8C8C8C] dark:text-[#6E6E73]">
            <AlignLeft className="w-5 h-5 opacity-70" />
          </div>
          <p className="text-xs font-semibold text-[#222222] dark:text-[#F5F5F7]">
            This request does not have a body
          </p>
          <p className="text-[11px] text-[#8C8C8C] dark:text-[#6E6E73] mt-1 font-mono">
            Select JSON, Text, Form Data, or URL Encoded from the tabs above to attach a payload.
          </p>
        </div>
      ) : (
        <div className="flex-1 flex flex-col min-h-[160px] relative">
          <textarea
            value={activeContent}
            onChange={(e) => handleContentChange(e.target.value)}
            placeholder={
              activeType === "json"
                ? '{\n  "key": "value"\n}'
                : activeType === "form-data"
                ? "key1=value1\nkey2=value2"
                : activeType === "urlencoded"
                ? "key1=value1&key2=value2"
                : "Raw text payload..."
            }
            rows={8}
            className="w-full flex-1 p-3 rounded-lg bg-[#FAF3E1]/20 dark:bg-[#0B0B0D] border border-[#E6D2A5]/70 dark:border-[#2C2C2E] text-xs font-mono text-[#222222] dark:text-[#F5F5F7] placeholder-[#8C8C8C] dark:placeholder-[#6E6E73] leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#FF6D1F]/20 focus:border-[#FF6D1F] transition-all resize-y shadow-2xs min-h-[120px]"
            spellCheck="false"
            aria-label="Request Body Content"
          />

          {/* Footer Metrics */}
          <div className="flex items-center justify-between text-[10px] font-mono text-[#8C8C8C] dark:text-[#6E6E73] pt-1.5 px-1">
            <span>
              Format: <span className="uppercase text-[#FF6D1F] font-semibold">{activeType}</span>
            </span>
            <span>
              {lineCount} {lineCount === 1 ? "line" : "lines"} · {byteCount} B
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default BodyEditor;
