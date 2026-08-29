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

const requestBodySchema = z.object({
  type: z
    .enum(["none", "json", "text", "form-data", "urlencoded"], {
      errorMap: () => ({ message: "Invalid request body type" }),
    })
    .optional()
    .default("none"),
  content: z.string().optional().default(""),
});

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

  collection: objectIdValidation("Invalid collection ID format"),

  headers: z.array(keyValuePairSchema).optional().default([]),

  queryParams: z.array(keyValuePairSchema).optional().default([]),

  body: requestBodySchema.optional().default({ type: "none", content: "" }),

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

  headers: z.array(keyValuePairSchema).optional(),

  queryParams: z.array(keyValuePairSchema).optional(),

  body: requestBodySchema.optional(),

  order: z.coerce
    .number({ invalid_type_error: "Order must be a number" })
    .min(0, "Order must be greater than or equal to 0")
    .optional(),
});
