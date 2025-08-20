import { PaymentStatus } from "@/enums";
import * as z from "zod";

export const paymentSchema = z.object({
  date: z.string().min(1, "Date is required"),
  classId: z.string().min(1, "Class is required"),
  amount: z.number().min(1, "Amount must be greater than 0"),
  status: z.enum(PaymentStatus),
  notes: z.string().optional(),
});

export type PaymentDataType = z.infer<typeof paymentSchema>;
export type PaymentDataInput = z.input<typeof paymentSchema>;
export type PaymentDataOutput = z.output<typeof paymentSchema>;

export const paymentValidationMessages = {
  date: "Date is required",
  classId: "Class is required",
  amount: "Amount must be greater than 0",
  status: "Status is required",
  notes: "Notes are optional",
} as const;

export const paymentDefaultValues = {
  date: new Date().toISOString(),
  classId: "",
  amount: 0,
  status: PaymentStatus.PENDING,
  notes: "",
} as const;
