import { z } from "zod";

const baseUrlValidation = z
  .string()
  .trim()
  .max(500, "Base URL must not exceed 500 characters")
  .optional()
  .refine(
    (val) => {
      if (!val || val === "") return true;
      try {
        const url = new URL(val);
        return url.protocol === "http:" || url.protocol === "https:";
      } catch {
        return false;
      }
    },
    {
      message:
        "Base URL must be a valid URL including protocol (e.g. https://api.example.com)",
    }
  );

const projectTypeValidation = z
  .enum(["rest"], {
    errorMap: () => ({ message: "Project type must be 'rest'" }),
  })
  .optional()
  .default("rest");

const settingsValidation = z
  .object({
    autoSave: z.boolean().optional().default(true),
    defaultTimeout: z
      .number({ invalid_type_error: "Default timeout must be a number" })
      .int("Default timeout must be an integer")
      .min(1000, "Default timeout must be at least 1000 ms")
      .max(120000, "Default timeout must not exceed 120000 ms")
      .optional()
      .default(30000),
  })
  .optional()
  .default({ autoSave: true, defaultTimeout: 30000 });

export const createProjectSchema = z.object({
  name: z
    .string({ required_error: "Project name is required" })
    .trim()
    .min(2, "Project name must be at least 2 characters")
    .max(100, "Project name must not exceed 100 characters"),

  description: z
    .string()
    .trim()
    .max(500, "Description must not exceed 500 characters")
    .optional()
    .default(""),

  baseUrl: baseUrlValidation,
  projectType: projectTypeValidation,
  settings: settingsValidation,
});

export const updateProjectSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Project name must be at least 2 characters")
    .max(100, "Project name must not exceed 100 characters")
    .optional(),

  description: z
    .string()
    .trim()
    .max(500, "Description must not exceed 500 characters")
    .optional(),

  baseUrl: baseUrlValidation,
  projectType: z
    .enum(["rest"], {
      errorMap: () => ({ message: "Project type must be 'rest'" }),
    })
    .optional(),

  settings: z
    .object({
      autoSave: z.boolean().optional(),
      defaultTimeout: z
        .number({ invalid_type_error: "Default timeout must be a number" })
        .int("Default timeout must be an integer")
        .min(1000, "Default timeout must be at least 1000 ms")
        .max(120000, "Default timeout must not exceed 120000 ms")
        .optional(),
    })
    .optional(),
});
