import { z } from "zod";

export const classSessionSchema = z.object({
  classId: z.string().min(1, "Class is required"),
  date: z
    .string()
    .min(1, "Date is required")
    .transform((val) => new Date(val)),
  fee: z.number().min(1, "Fee is required"),
  notes: z.string().optional(),
});

export type ClassSessionDataType = z.infer<typeof classSessionSchema>;
export type ClassSessionDataInputType = z.input<typeof classSessionSchema>;
export type ClassSessionDataOutputType = z.output<typeof classSessionSchema>;

export const classSessionValidationMessages = {
  classId: "Class is required",
  date: "Date is required",
  fee: "Fee is required",
  notes: "Notes are optional",
} as const;

export const classSessionDefaultValues = {
  date: new Date().toLocaleString(),
  fee: 0,
  notes: "",
} as const;
