import { ApiError } from "./ApiError.js";

/**
 * List of dangerous hosts blocked by basic SSRF protection.
 * Covers AWS, GCP, Azure, and OpenStack link-local cloud metadata services.
 */
const BLOCKED_SSRF_HOSTS = new Set([
  "169.254.169.254",
  "169.254.170.2",
  "metadata.google.internal",
  "metadata.internal",
  "instance-data",
  "0.0.0.0",
  "::ffff:169.254.169.254",
  "[::ffff:169.254.169.254]",
]);

/**
 * Checks if a hostname matches SSRF blocked patterns.
 *
 * @param {string} host - Target hostname to evaluate
 * @returns {boolean} True if host is blocked
 */
function isSsrfBlocked(host) {
  if (!host) return false;
  const lowerHost = host.toLowerCase().trim();

  if (BLOCKED_SSRF_HOSTS.has(lowerHost)) {
    return true;
  }

  // Block entire link-local IPv4 range (169.254.0.0/16)
  if (lowerHost.startsWith("169.254.")) {
    return true;
  }

  return false;
}

/**
 * Constructs and validates the final executable URL.
 * Enforces HTTP/HTTPS protocol validation and basic SSRF protection.
 *
 * @param {Object} options
 * @param {string} options.baseUrl - Collection or Project base URL
 * @param {string} options.reqUrl - Request endpoint or full URL
 * @returns {string} Fully validated URL string
 */
const buildRequestUrl = ({ baseUrl, reqUrl }) => {
  const cleanReq = (reqUrl || "").trim();
  const cleanBase = (baseUrl || "").trim();

  if (!cleanReq) {
    throw new ApiError(400, "Request URL is required");
  }

  let assembledUrl;

  // 1. Check if request URL is already absolute
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(cleanReq)) {
    assembledUrl = cleanReq;
  } else {
    if (!cleanBase) {
      throw new ApiError(
        400,
        "Base URL is required to execute relative request endpoints (e.g. /login)"
      );
    }
    const sanitizedBase = cleanBase.replace(/\/+$/, "");
    const sanitizedReq = cleanReq.replace(/^\/+/, "");
    assembledUrl = sanitizedReq ? `${sanitizedBase}/${sanitizedReq}` : sanitizedBase;
  }

  // 2. Parse and validate URL structure
  let parsedUrl;
  try {
    parsedUrl = new URL(assembledUrl);
  } catch {
    throw new ApiError(400, `Invalid request URL: "${assembledUrl}"`);
  }

  // 3. Protocol validation: strictly allow only http: and https:
  const protocol = parsedUrl.protocol.toLowerCase();
  if (protocol !== "http:" && protocol !== "https:") {
    throw new ApiError(
      400,
      `Invalid URL protocol "${protocol}". Only HTTP and HTTPS protocols are supported.`
    );
  }

  // 4. Basic SSRF Protection
  const hostname = parsedUrl.hostname;
  if (isSsrfBlocked(hostname)) {
    throw new ApiError(
      403,
      `Request blocked: Access to host "${hostname}" is forbidden by SSRF protection.`
    );
  }

  return assembledUrl;
};

export default buildRequestUrl;