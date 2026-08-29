import { Plus, Trash2 } from "lucide-react";

function KeyValueEditor({
  title,
  items = [],
  onChange,
  keyPlaceholder = "Key",
  valuePlaceholder = "Value",
  addButtonLabel = "Add Item",
  emptyMessage = "No items configured.",
}) {
  const handleUpdate = (index, field, value) => {
    if (!onChange) return;
    const updated = items.map((item, idx) => {
      if (idx === index) {
        return { ...item, [field]: value };
      }
      return item;
    });
    onChange(updated);
  };

  const handleAdd = () => {
    if (!onChange) return;
    onChange([...items, { key: "", value: "", enabled: true }]);
  };

  const handleDelete = (index) => {
    if (!onChange) return;
    onChange(items.filter((_, idx) => idx !== index));
  };

  return (
    <div className="space-y-3 w-full">
      {/* Title & Quick Add Row */}
      {title && (
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#222222] dark:text-[#F5F5F7]">
            {title}
          </span>
          <span className="text-[11px] font-mono text-[#8C8C8C] dark:text-[#6E6E73]">
            {items.length} {items.length === 1 ? "entry" : "entries"}
          </span>
        </div>
      )}

      {/* Table Container */}
      <div className="border border-[#E6D2A5]/70 dark:border-[#2C2C2E] rounded-lg overflow-hidden bg-[#FFFFFF] dark:bg-[#141416] shadow-2xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#FAF3E1]/60 dark:bg-[#1C1C1F] border-b border-[#E6D2A5]/60 dark:border-[#2C2C2E] text-[11px] font-mono font-medium text-[#5C5C5C] dark:text-[#A1A1A6]">
              <th className="py-2 px-3 font-semibold">Key</th>
              <th className="py-2 px-3 font-semibold">Value</th>
              <th className="py-2 px-3 font-semibold text-center w-20">Enabled</th>
              <th className="py-2 px-2 text-center w-10">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="py-6 text-center text-xs font-mono text-[#8C8C8C] dark:text-[#6E6E73] bg-[#FAF3E1]/10 dark:bg-transparent"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              items.map((item, idx) => {
                const isEnabled = item.enabled ?? true;
                return (
                  <tr
                    key={idx}
                    className={`border-b border-[#FAF3E1] dark:border-[#1F1F23] last:border-b-0 hover:bg-[#FAF3E1]/20 dark:hover:bg-[#1C1C1F]/40 transition-colors ${
                      !isEnabled ? "opacity-50" : ""
                    }`}
                  >
                    {/* Key Input Cell */}
                    <td className="p-1.5 pl-3">
                      <input
                        type="text"
                        value={item.key || ""}
                        onChange={(e) => handleUpdate(idx, "key", e.target.value)}
                        placeholder={keyPlaceholder}
                        className="w-full px-2.5 py-1.5 rounded-md bg-[#FAF3E1]/30 dark:bg-[#0B0B0D] border border-transparent focus:border-[#FF6D1F] focus:bg-[#FFFFFF] dark:focus:bg-[#141416] text-xs font-mono text-[#222222] dark:text-[#F5F5F7] placeholder-[#8C8C8C] dark:placeholder-[#6E6E73] focus:outline-none focus:ring-1 focus:ring-[#FF6D1F] transition-all"
                        aria-label={`${keyPlaceholder} at row ${idx + 1}`}
                      />
                    </td>

                    {/* Value Input Cell */}
                    <td className="p-1.5">
                      <input
                        type="text"
                        value={item.value || ""}
                        onChange={(e) => handleUpdate(idx, "value", e.target.value)}
                        placeholder={valuePlaceholder}
                        className="w-full px-2.5 py-1.5 rounded-md bg-[#FAF3E1]/30 dark:bg-[#0B0B0D] border border-transparent focus:border-[#FF6D1F] focus:bg-[#FFFFFF] dark:focus:bg-[#141416] text-xs font-mono text-[#222222] dark:text-[#F5F5F7] placeholder-[#8C8C8C] dark:placeholder-[#6E6E73] focus:outline-none focus:ring-1 focus:ring-[#FF6D1F] transition-all"
                        aria-label={`${valuePlaceholder} at row ${idx + 1}`}
                      />
                    </td>

                    {/* Enabled Checkbox Cell */}
                    <td className="p-1.5 text-center">
                      <input
                        type="checkbox"
                        checked={isEnabled}
                        onChange={(e) =>
                          handleUpdate(idx, "enabled", e.target.checked)
                        }
                        className="w-4 h-4 rounded border-[#E6D2A5] dark:border-[#2C2C2E] accent-[#FF6D1F] text-[#FF6D1F] focus:ring-[#FF6D1F] cursor-pointer"
                        aria-label={`Enable row ${idx + 1}`}
                      />
                    </td>

                    {/* Delete Action Cell */}
                    <td className="p-1.5 text-center pr-2">
                      <button
                        type="button"
                        onClick={() => handleDelete(idx)}
                        className="p-1 text-[#8C8C8C] dark:text-[#6E6E73] hover:text-[#DC2626] dark:hover:text-[#F87171] rounded transition-colors cursor-pointer"
                        title="Delete entry"
                        aria-label={`Delete row ${idx + 1}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Add Button Centered/Aligned */}
      <div className="flex justify-center pt-1">
        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-[#FF6D1F] hover:text-[#E85B0F] hover:bg-[#FAF3E1] dark:hover:bg-[#1C1C1F] rounded-md transition-colors cursor-pointer border border-dashed border-[#E6D2A5] dark:border-[#2C2C2E]"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{addButtonLabel}</span>
        </button>
      </div>
    </div>
  );
}

export default KeyValueEditor;
