import { z } from "zod";
import mongoose from "mongoose";

const objectIdValidation = z
  .string()
  .trim()
  .refine((val) => !val || mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid parent collection ID format",
  })
  .nullable()
  .optional();

export const createCollectionSchema = z.object({
  name: z
    .string({ required_error: "Collection name is required" })
    .trim()
    .min(2, "Collection name must be at least 2 characters")
    .max(100, "Collection name must not exceed 100 characters"),

  description: z
    .string()
    .trim()
    .max(500, "Description must not exceed 500 characters")
    .optional()
    .default(""),

  parent: objectIdValidation.default(null),

  order: z
    .number({ invalid_type_error: "Order must be a number" })
    .min(0, "Order must be greater than or equal to 0")
    .optional()
    .default(0),
});

export const updateCollectionSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Collection name must be at least 2 characters")
    .max(100, "Collection name must not exceed 100 characters")
    .optional(),

  description: z
    .string()
    .trim()
    .max(500, "Description must not exceed 500 characters")
    .optional(),

  parent: objectIdValidation,

  order: z
    .number({ invalid_type_error: "Order must be a number" })
    .min(0, "Order must be greater than or equal to 0")
    .optional(),
});
