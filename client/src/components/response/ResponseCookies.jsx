import { useState, useMemo } from "react";
import { Cookie, Eye, EyeOff } from "lucide-react";

/**
 * Cookie names that should have their values masked by default.
 */
const SENSITIVE_COOKIE_NAMES = [
  "session",
  "sessionid",
  "session_id",
  "sid",
  "connect.sid",
  "refreshtoken",
  "refresh_token",
  "accesstoken",
  "access_token",
  "token",
  "jwt",
  "csrf",
  "csrftoken",
  "csrf_token",
  "xsrf-token",
  "_csrf",
  "auth",
  "authorization",
];

/**
 * Check if a cookie name is considered sensitive.
 */
function isSensitiveCookie(name) {
  return SENSITIVE_COOKIE_NAMES.includes(name.toLowerCase());
}

/**
 * Parse Set-Cookie or cookie headers into structured entries.
 */
function parseCookies(headers = {}) {
  const cookies = [];

  // Check for set-cookie headers (case-insensitive)
  const setCookieKey = Object.keys(headers).find(
    (k) => k.toLowerCase() === "set-cookie"
  );

  if (setCookieKey) {
    const rawValue = headers[setCookieKey];
    const cookieStrings = Array.isArray(rawValue)
      ? rawValue
      : String(rawValue).split(/,(?=\s*\w+=)/);

    cookieStrings.forEach((cookieStr, idx) => {
      const parts = cookieStr.trim().split(";");
      const [nameValue, ...attributes] = parts;
      const eqIndex = nameValue.indexOf("=");

      if (eqIndex > 0) {
        const name = nameValue.substring(0, eqIndex).trim();
        cookies.push({
          id: `cookie_${idx}`,
          name,
          value: nameValue.substring(eqIndex + 1).trim(),
          sensitive: isSensitiveCookie(name),
          attributes: attributes.map((a) => a.trim()).filter(Boolean),
          raw: cookieStr.trim(),
        });
      }
    });
  }

  return cookies;
}

/**
 * Inline sensitive-value toggle for a single cookie.
 */
function CookieValue({ value, sensitive }) {
  const [revealed, setRevealed] = useState(false);

  if (!sensitive) {
    return (
      <span className="text-[#222222] dark:text-[#F5F5F7]">{value}</span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="text-[#222222] dark:text-[#F5F5F7]">
        {revealed ? value : "••••••••••"}
      </span>
      <button
        type="button"
        onClick={() => setRevealed(!revealed)}
        className="p-0.5 rounded text-[#8C8C8C] hover:text-[#FF6D1F] transition-colors cursor-pointer"
        title={revealed ? "Hide value" : "Reveal value"}
      >
        {revealed ? (
          <EyeOff className="w-3 h-3" />
        ) : (
          <Eye className="w-3 h-3" />
        )}
      </button>
    </span>
  );
}

export default function ResponseCookies({
  headers = {},
}) {
  const cookies = useMemo(() => parseCookies(headers), [headers]);

  if (cookies.length === 0) {
    return (
      <div className="p-6 flex flex-col items-center justify-center text-center flex-1">
        <Cookie className="w-7 h-7 text-[#8C8C8C] dark:text-[#6E6E73] opacity-40 mb-2" />
        <p className="text-xs font-medium text-[#222222] dark:text-[#F5F5F7]">
          No Cookies
        </p>
        <p className="text-[11px] text-[#8C8C8C] dark:text-[#6E6E73] mt-0.5">
          The response did not include any Set-Cookie headers.
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
              Name
            </th>
            <th className="py-2 px-3 font-semibold uppercase text-[10px] tracking-wider">
              Value
            </th>
            <th className="py-2 px-3 font-semibold uppercase text-[10px] tracking-wider">
              Attributes
            </th>
          </tr>
        </thead>
        <tbody>
          {cookies.map((cookie) => (
            <tr
              key={cookie.id}
              className="border-b border-[#FAF3E1] dark:border-[#1F1F23] hover:bg-[#FAF3E1]/40 dark:hover:bg-[#141416] transition-colors"
            >
              <td className="py-2 px-3 align-top select-text">
                <span className="font-semibold text-[#FF6D1F]">
                  {cookie.name}
                </span>
                {cookie.sensitive && (
                  <span className="ml-1.5 px-1 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wider bg-[#FEF2F2] dark:bg-[#200B0D] text-[#DC2626] dark:text-[#F87171] border border-[#FECACA]/50 dark:border-[#7F1D1D]/50">
                    sensitive
                  </span>
                )}
              </td>
              <td className="py-2 px-3 break-all select-text max-w-[200px]">
                <CookieValue
                  value={cookie.value}
                  sensitive={cookie.sensitive}
                />
              </td>
              <td className="py-2 px-3 text-[#8C8C8C] dark:text-[#A1A1A6] select-text">
                {cookie.attributes.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {cookie.attributes.map((attr, i) => (
                      <span
                        key={i}
                        className="px-1.5 py-0.5 rounded bg-[#FAF3E1] dark:bg-[#1C1C1F] border border-[#E6D2A5]/50 dark:border-[#2C2C2E] text-[10px]"
                      >
                        {attr}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-[#8C8C8C] italic">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
