/**
 * Response formatting utilities for APIPilot.
 *
 * Handles content-type detection, JSON formatting, and
 * safe display of non-JSON responses (text/plain, text/html, application/xml).
 */

/**
 * JSON-compatible content type patterns.
 *
 * @type {RegExp[]}
 */
const JSON_CONTENT_TYPES = [
  /^application\/json/i,
  /^application\/\w+\+json/i,
];

/**
 * Detects if a content type is JSON-compatible.
 *
 * @param {string} contentType - The Content-Type header value
 * @returns {boolean}
 */
export function isJsonContentType(contentType) {
  if (!contentType) return false;
  const ct = contentType.split(";")[0].trim();
  return JSON_CONTENT_TYPES.some((pattern) => pattern.test(ct));
}

/**
 * Detects the response content category from a Content-Type header.
 *
 * @param {string} contentType - The Content-Type header value
 * @returns {"json"|"xml"|"html"|"text"}
 */
export function detectContentType(contentType) {
  if (!contentType) return "text";
  const ct = contentType.split(";")[0].trim().toLowerCase();

  if (isJsonContentType(ct)) return "json";
  if (ct.includes("xml")) return "xml";
  if (ct.includes("html")) return "html";
  return "text";
}

/**
 * Attempts to parse a string as JSON.
 * Returns the parsed object on success, or null on failure.
 *
 * @param {string} str
 * @returns {object|null}
 */
function tryParseJson(str) {
  if (typeof str !== "string") return null;
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
}

/**
 * Formats response body data into a displayable string.
 *
 * - For JSON content-types: pretty-prints or minifies the data.
 * - For non-JSON: returns the raw string representation.
 * - Does NOT blindly parse strings containing `{` as JSON unless the
 *   content-type confirms it.
 *
 * @param {*} data - Response body data (object, string, or other)
 * @param {object} options
 * @param {boolean} [options.pretty=true] - Whether to pretty-print JSON
 * @param {string} [options.contentType=""] - The response Content-Type header value
 * @returns {string}
 */
export function formatResponseBody(data, { pretty = true, contentType = "" } = {}) {
  if (data === undefined || data === null) return "";

  const category = detectContentType(contentType);

  // Already a JS object (pre-parsed by axios or server) — treat as JSON
  if (typeof data === "object") {
    try {
      return JSON.stringify(data, null, pretty ? 2 : 0);
    } catch {
      return String(data);
    }
  }

  // String data
  if (typeof data === "string") {
    // Only attempt JSON parse if content-type says JSON
    if (category === "json") {
      const parsed = tryParseJson(data);
      if (parsed !== null) {
        return JSON.stringify(parsed, null, pretty ? 2 : 0);
      }
    }

    // For HTML, XML, plain text — return as-is
    return data;
  }

  return String(data);
}

/**
 * Legacy-compatible wrapper that matches the old signature used in responseUtils.js.
 * Kept for backward compatibility with any direct imports.
 *
 * @param {*} data
 * @param {boolean} isPretty
 * @returns {string}
 */
export function formatResponseBodyLegacy(data, isPretty = true) {
  return formatResponseBody(data, { pretty: isPretty });
}
