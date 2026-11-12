import { PaymentStatus } from "@/enums/payment-status";
import { z } from "zod";

export interface PaymentFilters {
  status?: PaymentStatus[];
  classIds?: string[];
  dateRange?: string;
}

export interface PaymentPagination {
  pageIndex: number;
  pageSize: number;
}

const filtersSchema = z.object({
  status: z.array(z.enum(PaymentStatus)).optional(),
  classIds: z.array(z.uuid().transform((id) => id.toLowerCase())).optional(),
  dateRange: z.string().optional(),
});

export function parsePaymentDateRange(dateRange: string): {
  from: Date;
  to: Date;
} {
  if (!/^\d+-\d+$/.test(dateRange)) {
    throw new Error("Invalid payment date range");
  }
  const [fromMilliseconds, toMilliseconds] = dateRange.split("-").map(Number);
  const from = new Date(fromMilliseconds);
  const to = new Date(toMilliseconds);
  if (
    !Number.isSafeInteger(fromMilliseconds) ||
    !Number.isSafeInteger(toMilliseconds) ||
    !Number.isFinite(from.getTime()) ||
    !Number.isFinite(to.getTime()) ||
    from > to
  ) {
    throw new Error("Invalid payment date range");
  }
  return { from, to };
}

export function normalizePaymentFilters(input: unknown = {}): PaymentFilters {
  const parsed = filtersSchema.parse(input);
  const filters: PaymentFilters = {};
  if (parsed.status?.length) {
    filters.status = [...new Set(parsed.status)].sort();
  }
  if (parsed.classIds?.length) {
    filters.classIds = [...new Set(parsed.classIds)].sort();
  }
  if (parsed.dateRange !== undefined) {
    const { from, to } = parsePaymentDateRange(parsed.dateRange);
    filters.dateRange = `${from.getTime()}-${to.getTime()}`;
  }
  return filters;
}

export function parsePaymentPagination(input: unknown = {}): PaymentPagination {
  return z
    .object({
      pageIndex: z.number().int().nonnegative().default(0),
      pageSize: z
        .union([
          z.literal(10),
          z.literal(20),
          z.literal(30),
          z.literal(40),
          z.literal(50),
        ])
        .default(10),
    })
    .refine(
      ({ pageIndex, pageSize }) => Number.isSafeInteger(pageIndex * pageSize),
      {
        message: "Payment page offset is too large",
      }
    )
    .parse(input);
}

export function filtersFromColumns(
  columns: readonly { id: string; value: unknown }[]
): PaymentFilters {
  const dateValue = columns.find((column) => column.id === "date")?.value;
  const dates =
    dateValue === undefined
      ? undefined
      : z.tuple([z.number(), z.number()]).parse(dateValue);
  return normalizePaymentFilters({
    status: columns.find((column) => column.id === "status")?.value,
    classIds: columns.find((column) => column.id === "class")?.value,
    dateRange: dates ? `${dates[0]}-${dates[1]}` : undefined,
  });
}
