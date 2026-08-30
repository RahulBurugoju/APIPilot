import { z } from "zod";
import mongoose from "mongoose";

/**
 * Regex for predictable variable key formats:
 * - SCREAMING_SNAKE_CASE: BASE_URL, API_KEY
 * - camelCase: baseUrl, accessToken
 * - snake_case: user_id, auth_token
 * - PascalCase: BaseUrl
 * Must start with a letter or underscore and contain only alphanumeric characters and underscores.
 */
export const VARIABLE_KEY_REGEX = /^[a-zA-Z_][a-zA-Z0-9_]*$/;

/**
 * ObjectId validation helper
 */
const objectIdValidation = (message = "Invalid ObjectId format") =>
  z
    .string()
    .trim()
    .refine((val) => mongoose.Types.ObjectId.isValid(val), {
      message,
    });

/**
 * Preprocessor to handle stringified JSON arrays (e.g. from multipart form data or query strings)
 */
const parseArrayPreprocess = (val) => {
  if (typeof val === "string") {
    try {
      const parsed = JSON.parse(val);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return val;
};

/**
 * Variable value schema:
 * Allows strings, numbers, booleans (coerced to string).
 * Does not restrict values to URLs or numbers.
 * Supports: "123", 123, "true", true, "hello", "https://example.com", "eyJhbGci...", etc.
 */
export const variableValueSchema = z
  .preprocess(
    (val) => (val === null || val === undefined ? "" : val),
    z.union([z.string(), z.number(), z.boolean()]).transform((val) => String(val))
  )
  .default("");

/**
 * Environment variable schema
 */
export const environmentVariableSchema = z.object({
  key: z
    .string({ required_error: "Variable key is required" })
    .trim()
    .min(1, "Variable key cannot be empty")
    .max(100, "Variable key must not exceed 100 characters")
    .regex(
      VARIABLE_KEY_REGEX,
      "Variable key must follow a predictable format like BASE_URL, baseUrl, accessToken, or user_id (letters, numbers, underscores only, cannot start with a number)"
    ),

  value: variableValueSchema,

  enabled: z.boolean().optional().default(true),

  secret: z.boolean().optional().default(false),
});

/**
 * Schema for creating a new environment
 */
export const createEnvironmentSchema = z
  .object({
    name: z
      .string({ required_error: "Environment name is required" })
      .trim()
      .min(1, "Environment name is required")
      .max(100, "Environment name must not exceed 100 characters"),

    project: objectIdValidation("Invalid project ID format").optional(),

    projectId: objectIdValidation("Invalid project ID format").optional(),

    variable: z.preprocess(
      parseArrayPreprocess,
      z.array(environmentVariableSchema).optional()
    ),

    variables: z.preprocess(
      parseArrayPreprocess,
      z.array(environmentVariableSchema).optional()
    ),

    isActive: z.boolean().optional().default(false),
  })
  .transform((data) => {
    // Harmonize variables vs variable so Mongoose model always receives data.variable
    const vars =
      data.variables !== undefined
        ? data.variables
        : data.variable !== undefined
        ? data.variable
        : [];

    return {
      ...data,
      variable: vars,
      variables: vars,
    };
  });

/**
 * Schema for updating an existing environment
 */
export const updateEnvironmentSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Environment name must be at least 1 character")
      .max(100, "Environment name must not exceed 100 characters")
      .optional(),

    variable: z.preprocess(
      parseArrayPreprocess,
      z.array(environmentVariableSchema).optional()
    ),

    variables: z.preprocess(
      parseArrayPreprocess,
      z.array(environmentVariableSchema).optional()
    ),

    isActive: z.boolean().optional(),
  })
  .transform((data) => {
    const result = { ...data };
    if (data.variables !== undefined || data.variable !== undefined) {
      const vars =
        data.variables !== undefined ? data.variables : data.variable;
      result.variable = vars;
      result.variables = vars;
    }
    return result;
  });

/**
 * Schema for updating/setting environment variables in bulk
 */
export const setVariablesSchema = z
  .object({
    variable: z.preprocess(
      parseArrayPreprocess,
      z.array(environmentVariableSchema).optional()
    ),
    variables: z.preprocess(
      parseArrayPreprocess,
      z.array(environmentVariableSchema).optional()
    ),
  })
  .transform((data) => {
    const vars =
      data.variables !== undefined
        ? data.variables
        : data.variable !== undefined
        ? data.variable
        : [];
    return {
      ...data,
      variable: vars,
      variables: vars,
    };
  });

export default {
  environmentVariableSchema,
  createEnvironmentSchema,
  updateEnvironmentSchema,
  setVariablesSchema,
  VARIABLE_KEY_REGEX,
};
