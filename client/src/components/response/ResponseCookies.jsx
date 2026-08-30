import { useMemo } from "react";
import { Cookie } from "lucide-react";

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
        cookies.push({
          id: `cookie_${idx}`,
          name: nameValue.substring(0, eqIndex).trim(),
          value: nameValue.substring(eqIndex + 1).trim(),
          attributes: attributes.map((a) => a.trim()).filter(Boolean),
          raw: cookieStr.trim(),
        });
      }
    });
  }

  return cookies;
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
              <td className="py-2 px-3 font-semibold text-[#FF6D1F] align-top select-text">
                {cookie.name}
              </td>
              <td className="py-2 px-3 text-[#222222] dark:text-[#F5F5F7] break-all select-text max-w-[200px] truncate">
                {cookie.value}
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
