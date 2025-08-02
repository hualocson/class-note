import { z } from "zod";

export const classSchema = z.object({
  name: z
    .string()
    .min(1, "Class name is required")
    .max(100, "Class name must be less than 100 characters")
    .trim(),

  code: z
    .string()
    .max(20, "Class code must be less than 20 characters")
    .optional()
    .or(z.literal(""))
    .transform((val) => (val === "" ? undefined : val)),

  price: z
    .number()
    .min(0, "Price must be a positive number")
    .max(999999999, "Price is too high")
    .transform((val) => Math.round(val)), // Ensure integer for VND

  color: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, "Color must be a valid hex color")
    .default("#3b82f6"),

  sortOrder: z
    .number()
    .int()
    .min(0, "Sort order must be a positive integer")
    .default(0)
    .optional(),
});

export type ClassDataType = z.infer<typeof classSchema>;
export type ClassDataInputType = z.input<typeof classSchema>;
export type ClassDataOutputType = z.output<typeof classSchema>;

// Validation messages for better UX
export const classValidationMessages = {
  name: {
    required: "Please enter a class name",
    tooLong: "Class name is too long",
  },
  code: {
    tooLong: "Class code is too long",
  },
  price: {
    required: "Please enter a price",
    invalid: "Please enter a valid price",
    tooHigh: "Price is too high",
  },
  color: {
    invalid: "Please select a valid color",
  },
} as const;

// Default values for the form
export const classDefaultValues = {
  name: "",
  code: "",
  price: 0,
  color: "#3b82f6",
  sortOrder: 0,
} as const;
