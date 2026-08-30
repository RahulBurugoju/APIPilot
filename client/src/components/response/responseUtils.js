/**
 * Shared response utility helpers for the APIPilot ResponseViewer components.
 */

/**
 * Returns a semantic status type string for a given HTTP status code.
 *
 * @param {number|null} status - HTTP status code
 * @returns {"success"|"redirect"|"client-error"|"server-error"|"unknown"}
 */
export function getStatusType(status) {
  if (!status || status === 0) return "unknown";
  if (status >= 200 && status < 300) return "success";
  if (status >= 300 && status < 400) return "redirect";
  if (status >= 400 && status < 500) return "client-error";
  if (status >= 500) return "server-error";
  return "unknown";
}

/**
 * Returns Tailwind color classes for a given status type.
 *
 * @param {string} statusType - One of: "success", "redirect", "client-error", "server-error", "unknown"
 * @returns {string} Tailwind class string
 */
export function getStatusColorClass(statusType) {
  switch (statusType) {
    case "success":
      return "text-[#059669] dark:text-[#00E599] bg-[#ECFDF5] dark:bg-[#062417] border-[#A7F3D0] dark:border-[#104D30]";
    case "redirect":
      return "text-[#2563EB] dark:text-[#60A5FA] bg-[#EFF6FF] dark:bg-[#0A1B36] border-[#BFDBFE] dark:border-[#1E3A8A]";
    case "client-error":
      return "text-[#D97706] dark:text-[#FBBF24] bg-[#FFFBEB] dark:bg-[#201806] border-[#FDE68A] dark:border-[#78350F]";
    case "server-error":
      return "text-[#DC2626] dark:text-[#F87171] bg-[#FEF2F2] dark:bg-[#200B0D] border-[#FECACA] dark:border-[#7F1D1D]";
    default:
      return "text-[#DC2626] dark:text-[#F87171] bg-[#FEF2F2] dark:bg-[#200B0D] border-[#FECACA] dark:border-[#7F1D1D]";
  }
}

/**
 * Format bytes into human readable format (B, KB, MB, GB).
 *
 * @param {number} bytes
 * @returns {string}
 */
export function formatBytes(bytes) {
  if (!bytes || bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

/**
 * Formats response body data into a displayable string.
 *
 * @param {*} data - Response data (object, string, or other)
 * @param {boolean} isPretty - Whether to pretty-print JSON
 * @returns {string}
 */
export function formatResponseBody(data, isPretty = true) {
  if (data === undefined || data === null) return "";
  if (typeof data === "object") {
    try {
      return JSON.stringify(data, null, isPretty ? 2 : 0);
    } catch {
      return String(data);
    }
  }
  if (typeof data === "string") {
    try {
      const parsed = JSON.parse(data);
      return JSON.stringify(parsed, null, isPretty ? 2 : 0);
    } catch {
      return data;
    }
  }
  return String(data);
}
