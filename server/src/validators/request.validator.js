import { z } from "zod";
import mongoose from "mongoose";

const objectIdValidation = (message = "Invalid ObjectId format") =>
  z
    .string({ required_error: "ID is required" })
    .trim()
    .refine((val) => mongoose.Types.ObjectId.isValid(val), {
      message,
    });

const optionalObjectIdValidation = (message = "Invalid ObjectId format") =>
  z
    .preprocess(
      (val) => (val === "" ? null : val),
      z.string().trim().nullable().optional()
    )
    .refine((val) => !val || mongoose.Types.ObjectId.isValid(val), {
      message,
    });

const httpMethodEnum = z.enum(
  ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"],
  {
    errorMap: () => ({
      message:
        "Method must be one of GET, POST, PUT, PATCH, DELETE, HEAD, or OPTIONS",
    }),
  }
);

const keyValuePairSchema = z.object({
  key: z.string().trim().optional().default(""),
  value: z.string().trim().optional().default(""),
  enabled: z.boolean().optional().default(true),
});

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

const arrayOrJsonString = (defaultVal = []) =>
  z.preprocess(
    parseArrayPreprocess,
    z.array(keyValuePairSchema).optional().default(defaultVal)
  );

const parseBodyPreprocess = (val) => {
  if (val === null || val === undefined) {
    return { type: "none", content: "" };
  }
  if (typeof val === "string") {
    try {
      const parsed = JSON.parse(val);
      if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) {
        return parsed;
      }
    } catch {
      // Fall through if not stringified JSON object
    }
    return { type: "json", content: val };
  }
  return val;
};

const requestBodySchema = z.preprocess(
  parseBodyPreprocess,
  z
    .object({
      type: z
        .enum(["none", "json", "text", "form-data", "urlencoded"], {
          errorMap: () => ({ message: "Invalid request body type" }),
        })
        .optional()
        .default("none"),
      content: z.string().optional().default(""),
    })
    .optional()
    .default({ type: "none", content: "" })
);

export const createRequestSchema = z.object({
  name: z
    .string({ required_error: "Request name is required" })
    .trim()
    .min(2, "Request name must be at least 2 characters")
    .max(150, "Request name must not exceed 150 characters"),

  method: httpMethodEnum.optional().default("GET"),

  url: z
    .string()
    .trim()
    .max(2000, "URL must not exceed 2000 characters")
    .optional()
    .default(""),

  collection: optionalObjectIdValidation("Invalid collection ID format"),

  headers: arrayOrJsonString([]),

  queryParams: arrayOrJsonString([]),

  body: requestBodySchema,

  order: z.coerce
    .number({ invalid_type_error: "Order must be a number" })
    .min(0, "Order must be greater than or equal to 0")
    .optional()
    .default(0),
});

export const updateRequestSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Request name must be at least 2 characters")
    .max(150, "Request name must not exceed 150 characters")
    .optional(),

  method: httpMethodEnum.optional(),

  url: z
    .string()
    .trim()
    .max(2000, "URL must not exceed 2000 characters")
    .optional(),

  collection: optionalObjectIdValidation("Invalid collection ID format"),

  headers: z.preprocess(parseArrayPreprocess, z.array(keyValuePairSchema).optional()),

  queryParams: z.preprocess(parseArrayPreprocess, z.array(keyValuePairSchema).optional()),

  body: requestBodySchema,

  order: z.coerce
    .number({ invalid_type_error: "Order must be a number" })
    .min(0, "Order must be greater than or equal to 0")
    .optional(),
});
