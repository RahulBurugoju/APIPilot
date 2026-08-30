/**
 * Utility functions for URL and Query Parameter bi-directional synchronization.
 */

/**
 * Reconstructs a full URL by combining a base URL and an array of query parameters.
 * Only enabled parameters with non-empty keys are included in the query string.
 *
 * @param {string} url - Current URL string (may or may not already have a query string).
 * @param {Array<{key: string, value: string, enabled?: boolean}>} queryParams - Array of param objects.
 * @returns {string} The updated URL with synchronized query parameters.
 */
export function buildUrlWithQueryParams(url, queryParams) {
  const currentUrl = typeof url === "string" ? url : "";

  // Separate hash part (#) if any
  const [urlWithoutHash, hash] = currentUrl.split("#");
  // Separate base path from query string (?...)
  const baseWithoutQuery = urlWithoutHash.split("?")[0];

  const activeParams = (queryParams || []).filter(
    (p) => p && p.enabled !== false && p.key && p.key.trim() !== ""
  );

  if (activeParams.length === 0) {
    return hash !== undefined ? `${baseWithoutQuery}#${hash}` : baseWithoutQuery;
  }

  const queryString = activeParams
    .map((p) => {
      const k = p.key.trim();
      const v = p.value !== undefined && p.value !== null ? p.value : "";
      return v !== "" ? `${k}=${v}` : k;
    })
    .join("&");

  const fullUrl = `${baseWithoutQuery}?${queryString}`;
  return hash !== undefined ? `${fullUrl}#${hash}` : fullUrl;
}

/**
 * Parses query parameters from a URL string into structured objects.
 * Preserves existing disabled parameters from the UI state.
 *
 * @param {string} url - The URL string containing optional ?key=value parameters.
 * @param {Array<{key: string, value: string, enabled?: boolean}>} [existingParams=[]] - Prior parameter state.
 * @returns {Array<{key: string, value: string, enabled: boolean}>}
 */
export function parseQueryParamsFromUrl(url, existingParams = []) {
  if (!url || typeof url !== "string") return [];

  const hasQuery = url.includes("?");
  const disabledParams = (existingParams || []).filter((p) => p && p.enabled === false);

  if (!hasQuery) {
    return disabledParams;
  }

  const queryPart = url.split("?")[1]?.split("#")[0] || "";
  if (!queryPart.trim()) {
    return disabledParams;
  }

  const pairs = queryPart.split("&").filter(Boolean);
  const parsedParams = pairs.map((pair) => {
    const eqIdx = pair.indexOf("=");
    let key, value;
    if (eqIdx !== -1) {
      key = pair.slice(0, eqIdx);
      value = pair.slice(eqIdx + 1);
    } else {
      key = pair;
      value = "";
    }
    return {
      key,
      value,
      enabled: true,
    };
  });

  return [...parsedParams, ...disabledParams];
}

/**
 * Extracts route path parameters (e.g. :id, :userId, :paramVariable) from a URL string.
 *
 * @param {string} url - The URL to inspect.
 * @returns {string[]} List of unique variable names (without colon).
 */
export function extractPathVariables(url) {
  if (!url || typeof url !== "string") return [];
  const pathname = url.split("?")[0].split("#")[0];
  const matches = [...pathname.matchAll(/(?:^|\/):([a-zA-Z0-9_-]+)/g)];
  return Array.from(new Set(matches.map((m) => m[1])));
}

/**
 * Combines a collection or project base URL (e.g. http://localhost:9000)
 * with a request endpoint path (e.g. /login) into a full executable URL (e.g. http://localhost:9000/login).
 * Handles trailing/leading slashes cleanly without double slashes.
 *
 * @param {string} baseUrl - Base URL string (e.g. http://localhost:9000)
 * @param {string} path - Request endpoint path (e.g. /login or /users?page=1)
 * @returns {string} The combined URL.
 */
export function combineBaseUrlAndPath(baseUrl, path) {
  const cleanBase = (baseUrl || "").trim();
  const cleanPath = (path || "").trim();

  if (!cleanBase) return cleanPath;
  if (!cleanPath) return cleanBase;

  // If path is already an absolute URL or begins with a template variable like {{baseUrl}}, use it directly
  if (/^https?:\/\//i.test(cleanPath) || cleanPath.startsWith("{{")) {
    return cleanPath;
  }

  const baseNoTrailing = cleanBase.endsWith("/") ? cleanBase.slice(0, -1) : cleanBase;
  const pathWithLeading = cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`;

  return `${baseNoTrailing}${pathWithLeading}`;
}

/**
 * Extracts the endpoint path from a URL if it begins with the given baseUrl.
 * E.g. extractEndpointPath("http://localhost:9000/login", "http://localhost:9000") -> "/login"
 *
 * @param {string} url - Full URL string
 * @param {string} baseUrl - Base URL prefix
 * @returns {string} Endpoint path
 */
export function extractEndpointPath(url, baseUrl) {
  if (!url || typeof url !== "string") return "";

  // If url begins with a template variable {{...}}, preserve it as-is
  if (url.trim().startsWith("{{")) {
    return url;
  }

  const cleanBase = (baseUrl || "").trim().replace(/\/+$/, "");

  if (cleanBase && url.startsWith(cleanBase)) {
    const remainder = url.slice(cleanBase.length);
    return remainder.startsWith("/") ? remainder : `/${remainder}`;
  }

  return url;
}
