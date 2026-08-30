import { ApiError } from "./ApiError.js";

/**
 * Regex for matching variable placeholder syntax: {{variableName}}
 * Matches standard alphanumeric identifier keys with underscores,
 * allowing optional whitespace inside the double braces.
 */
const VARIABLE_REGEX = /{{\s*([a-zA-Z0-9_]+)\s*}}/g;

/**
 * Normalizes variables input into a key-value dictionary.
 * Supports:
 * - Plain object: { baseUrl: "https://api.example.com", userId: 42 }
 * - Array of environment variable objects: [{ key: "baseUrl", value: "https://api.example.com", enabled: true }]
 * - Map instance: new Map([["baseUrl", "https://api.example.com"]])
 *
 * @param {Object|Array|Map} variables
 * @returns {Record<string, any>}
 */
export const normalizeVariablesMap = (variables) => {
  if (!variables) return {};

  if (Array.isArray(variables)) {
    const map = {};
    for (const item of variables) {
      if (item && item.key && item.enabled !== false) {
        map[item.key] =
          item.value !== undefined && item.value !== null ? item.value : "";
      }
    }
    return map;
  }

  if (variables instanceof Map) {
    const map = {};
    for (const [key, value] of variables.entries()) {
      map[key] = value;
    }
    return map;
  }

  if (typeof variables === "object") {
    return variables;
  }

  return {};
};

/**
 * Resolves variable placeholders {{variableName}} within a single string.
 * Throws a controlled 400 ApiError if a referenced variable is missing.
 *
 * @param {string} str - Template string containing {{variableName}} placeholders
 * @param {Record<string, any>} varMap - Normalized key-value lookup object
 * @param {Object} [options]
 * @param {boolean} [options.strict=true] - If true, throws ApiError(400) for missing variables
 * @returns {string} String with resolved values
 */
const resolveString = (str, varMap, options = {}) => {
  if (typeof str !== "string" || !str.includes("{{")) {
    return str;
  }

  const { strict = true } = options;

  return str.replace(VARIABLE_REGEX, (match, varName) => {
    if (
      Object.prototype.hasOwnProperty.call(varMap, varName) &&
      varMap[varName] !== undefined
    ) {
      const val = varMap[varName];
      return val !== null ? String(val) : "";
    }

    if (strict) {
      throw new ApiError(400, `Variable '${varName}' is not defined`);
    }

    // If not strict, preserve the original placeholder {{varName}}
    return match;
  });
};

/**
 * Resolves {{variableName}} placeholders against provided variables.
 *
 * Supports resolving:
 * - Template strings (e.g. "{{baseUrl}}/users/{{userId}}")
 * - Objects, arrays, headers, query parameters, or JSON payloads recursively
 *
 * @example
 * resolveVariables("{{baseUrl}}/users/{{userId}}", {
 *   baseUrl: "https://api.example.com",
 *   userId: 42
 * });
 * // => "https://api.example.com/users/42"
 *
 * @param {any} target - String, Object, or Array containing {{variableName}} syntax
 * @param {Object|Array|Map} variables - Variables dictionary or Environment variables array
 * @returns {any} Target with all {{variableName}} instances replaced by their corresponding values
 */
export const resolveVariables = (target, variables, options = { strict: true }) => {
  if (target === null || target === undefined) {
    return target;
  }

  const varMap = normalizeVariablesMap(variables);

  // 1. Primitive string input
  if (typeof target === "string") {
    return resolveString(target, varMap, options);
  }

  // 2. Array input: resolve recursively
  if (Array.isArray(target)) {
    return target.map((item) => resolveVariables(item, varMap, options));
  }

  // 3. Object input: resolve recursively across keys and values
  if (typeof target === "object") {
    const resolvedObj = {};
    for (const [key, value] of Object.entries(target)) {
      const resolvedKey = resolveString(key, varMap, options);
      resolvedObj[resolvedKey] = resolveVariables(value, varMap, options);
    }
    return resolvedObj;
  }

  // 4. Other primitives (numbers, booleans)
  return target;
};

export default resolveVariables;
