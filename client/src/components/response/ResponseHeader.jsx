import {
  CheckCircle2,
  AlertTriangle,
  ServerOff,
  Clock,
  Loader2,
} from "lucide-react";
import { getStatusType, getStatusColorClass, formatBytes } from "./responseUtils";

export default function ResponseHeader({
  response,
  loading = false,
}) {
  const statusType = response ? getStatusType(response.status) : null;
  const colorClass = statusType ? getStatusColorClass(statusType) : "";

  const statusIcon =
    statusType === "success" ? (
      <CheckCircle2 className="w-3 h-3" />
    ) : statusType === "unknown" ? (
      <ServerOff className="w-3 h-3" />
    ) : (
      <AlertTriangle className="w-3 h-3" />
    );

  return (
    <div className="flex items-center gap-2.5">
      <span className="text-xs font-semibold text-[#222222] dark:text-[#F5F5F7]">
        Response
      </span>

      {loading && (
        <span className="flex items-center gap-1.5 text-[11px] font-mono text-[#FF6D1F] animate-pulse">
          <Loader2 className="w-3 h-3 animate-spin" />
          <span>Executing...</span>
        </span>
      )}

      {response && !loading ? (
        <>
          {/* Status Code & Text Badge */}
          <div
            className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[11px] font-mono font-bold ${colorClass}`}
          >
            {statusIcon}
            <span>
              {response.status !== undefined ? response.status : ""}{" "}
              {response.status === 0
                ? "Connection Refused"
                : response.statusText || ""}
            </span>
          </div>

          {/* Execution Duration */}
          {response.duration !== undefined && (
            <div
              className="flex items-center gap-1 text-[11px] text-[#8C8C8C] dark:text-[#6E6E73] font-mono"
              title="Execution Duration"
            >
              <Clock className="w-3 h-3 text-[#FF6D1F]" />
              <span>{response.duration} ms</span>
            </div>
          )}

          {/* Response Size */}
          {response.size !== undefined && response.size > 0 && (
            <span
              className="text-[11px] text-[#8C8C8C] dark:text-[#6E6E73] font-mono"
              title="Response Size"
            >
              {formatBytes(response.size)}
            </span>
          )}
        </>
      ) : null}
    </div>
  );
}
