import { Clock, HardDrive, Globe, Hash, Info } from "lucide-react";
import { getStatusType, getStatusColorClass, formatBytes } from "./responseUtils";

export default function ResponseInfo({
  response,
}) {
  if (!response) return null;

  const statusType = getStatusType(response.status);
  const colorClass = getStatusColorClass(statusType);
  const contentType = response.contentType || response.headers?.["content-type"] || "—";

  const infoItems = [
    {
      label: "Status",
      value: `${response.status ?? "—"} ${response.statusText || ""}`,
      icon: <Hash className="w-3.5 h-3.5 text-[#FF6D1F]" />,
      badgeClass: colorClass,
    },
    {
      label: "Duration",
      value: response.duration !== undefined ? `${response.duration} ms` : "—",
      icon: <Clock className="w-3.5 h-3.5 text-[#FF6D1F]" />,
    },
    {
      label: "Size",
      value: response.size ? formatBytes(response.size) : "0 B",
      icon: <HardDrive className="w-3.5 h-3.5 text-[#8C8C8C]" />,
    },
    {
      label: "Content-Type",
      value: String(contentType).split(";")[0].trim(),
      icon: <Globe className="w-3.5 h-3.5 text-[#8C8C8C]" />,
    },
  ];

  return (
    <div className="p-4 space-y-3 max-w-lg">
      <h4 className="text-xs font-bold uppercase tracking-wider text-[#222222] dark:text-[#F5F5F7] flex items-center gap-2">
        <Info className="w-3.5 h-3.5 text-[#FF6D1F]" />
        <span>Response Metadata</span>
      </h4>

      <div className="divide-y divide-[#E6D2A5]/40 dark:divide-[#2C2C2E]/40">
        {infoItems.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between py-2.5 text-xs font-mono"
          >
            <div className="flex items-center gap-2 text-[#8C8C8C] dark:text-[#6E6E73]">
              {item.icon}
              <span className="font-semibold uppercase tracking-wider text-[10px]">
                {item.label}
              </span>
            </div>
            {item.badgeClass ? (
              <span
                className={`px-2 py-0.5 rounded-md border text-[11px] font-mono font-bold ${item.badgeClass}`}
              >
                {item.value}
              </span>
            ) : (
              <span className="text-[#222222] dark:text-[#F5F5F7] font-semibold">
                {item.value}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
