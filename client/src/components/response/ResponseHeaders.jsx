import { useMemo } from "react";

export default function ResponseHeaders({
  headers = {},
  searchQuery = "",
}) {
  const headerEntries = Object.entries(headers);

  const filteredHeaders = useMemo(() => {
    if (!searchQuery.trim()) return headerEntries;
    const q = searchQuery.toLowerCase();
    return headerEntries.filter(
      ([k, v]) =>
        k.toLowerCase().includes(q) || String(v).toLowerCase().includes(q)
    );
  }, [headerEntries, searchQuery]);

  if (filteredHeaders.length === 0) {
    return (
      <div className="p-3">
        <p className="text-xs font-mono text-[#8C8C8C] dark:text-[#6E6E73] p-4 text-center">
          {searchQuery
            ? "No matching headers found."
            : "No response headers received."}
        </p>
      </div>
    );
  }

  return (
    <div className="p-3">
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
    </div>
  );
}
