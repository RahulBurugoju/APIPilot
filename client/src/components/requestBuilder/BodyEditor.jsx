import { useState } from "react";
import { AlignLeft, Sparkles, Check } from "lucide-react";

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
      // If invalid JSON, leave untouched
    }
  };

  return (
    <div className="space-y-3 w-full">
      {/* Top Selector Bar */}
      <div className="flex items-center justify-between gap-3 pb-1 border-b border-[#FAF3E1] dark:border-[#1F1F23]">
        <div className="flex items-center gap-2">
          <label
            htmlFor="body-type-select"
            className="text-xs font-medium text-[#5C5C5C] dark:text-[#A1A1A6] select-none"
          >
            Body type:
          </label>
          <select
            id="body-type-select"
            value={activeType}
            onChange={(e) => handleTypeChange(e.target.value)}
            className="px-2.5 py-1.5 rounded-md bg-[#FFFFFF] dark:bg-[#141416] border border-[#E6D2A5] dark:border-[#2C2C2E] text-xs font-mono font-semibold text-[#FF6D1F] focus:outline-none focus:ring-1 focus:ring-[#FF6D1F] cursor-pointer shadow-2xs"
          >
            {BODY_TYPES.map((bt) => (
              <option
                key={bt.value}
                value={bt.value}
                className="font-sans font-normal text-[#222222] dark:text-[#F5F5F7] bg-[#FFFFFF] dark:bg-[#141416]"
              >
                {bt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Prettify Action if JSON */}
        {activeType === "json" && (
          <div className="flex items-center gap-2">
            {formatSuccess && (
              <span className="text-[11px] font-mono text-[#059669] dark:text-[#00E599] flex items-center gap-1">
                <Check className="w-3 h-3" /> Formatted
              </span>
            )}
            <button
              type="button"
              onClick={handlePrettifyJSON}
              className="inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium text-[#5C5C5C] dark:text-[#A1A1A6] hover:text-[#222222] dark:hover:text-[#F5F5F7] bg-[#FAF3E1]/60 dark:bg-[#1C1C1F] hover:bg-[#FAF3E1] dark:hover:bg-[#2C2C2E] border border-[#E6D2A5]/60 dark:border-[#2C2C2E] transition-colors cursor-pointer"
              title="Prettify JSON"
            >
              <Sparkles className="w-3 h-3 text-[#FF6D1F]" />
              <span>Prettify</span>
            </button>
          </div>
        )}
      </div>

      {/* Body Content Editor */}
      {activeType === "none" ? (
        <div className="p-8 text-center rounded-lg border border-dashed border-[#E6D2A5]/70 dark:border-[#2C2C2E] bg-[#FAF3E1]/20 dark:bg-[#141416]/30">
          <AlignLeft className="w-6 h-6 mx-auto text-[#8C8C8C] dark:text-[#6E6E73] mb-2 opacity-60" />
          <p className="text-xs font-medium text-[#5C5C5C] dark:text-[#A1A1A6]">
            This request does not have a body
          </p>
          <p className="text-[11px] text-[#8C8C8C] dark:text-[#6E6E73] mt-1 font-mono">
            Select JSON, Text, Form Data, or URL Encoded from above to attach data.
          </p>
        </div>
      ) : (
        <div className="relative">
          <textarea
            value={activeContent}
            onChange={(e) => handleContentChange(e.target.value)}
            placeholder={
              activeType === "json"
                ? '{\n  "name": "Rahul",\n  "email": "rahul@example.com"\n}'
                : activeType === "form-data"
                ? "field1=value1\nfield2=value2"
                : activeType === "urlencoded"
                ? "key1=value1&key2=value2"
                : "Raw text payload..."
            }
            rows={10}
            className="w-full p-3 rounded-lg bg-[#FAF3E1]/30 dark:bg-[#0B0B0D] border border-[#E6D2A5]/70 dark:border-[#2C2C2E] text-xs font-mono text-[#222222] dark:text-[#F5F5F7] placeholder-[#8C8C8C] dark:placeholder-[#6E6E73] leading-relaxed focus:outline-none focus:ring-1 focus:ring-[#FF6D1F] focus:border-[#FF6D1F] transition-all resize-y shadow-2xs"
            spellCheck="false"
            aria-label="Request Body Content"
          />
        </div>
      )}
    </div>
  );
}

export default BodyEditor;
