import "server-only";

import { db } from "@/db";
import {
  PaymentFilters,
  PaymentPagination,
  parsePaymentDateRange,
} from "@/lib/payment-filters";
import { classesTable } from "@/schemas/classes";
import { paymentsTable } from "@/schemas/payments";
import {
  and,
  desc,
  eq,
  getTableColumns,
  gte,
  inArray,
  lte,
  sql,
} from "drizzle-orm";

function paymentWhere(filters: PaymentFilters) {
  const range = filters.dateRange
    ? parsePaymentDateRange(filters.dateRange)
    : undefined;
  return and(
    eq(classesTable.isDeleted, false),
    filters.status?.length
      ? inArray(paymentsTable.status, filters.status)
      : undefined,
    filters.classIds?.length
      ? inArray(paymentsTable.classId, filters.classIds)
      : undefined,
    range ? gte(paymentsTable.date, range.from) : undefined,
    range ? lte(paymentsTable.date, range.to) : undefined
  );
}

export function buildPaymentRowsQuery(
  pagination: PaymentPagination,
  filters: PaymentFilters
) {
  return db
    .select({
      ...getTableColumns(paymentsTable),
      class: {
        name: classesTable.name,
        code: classesTable.code,
        color: classesTable.color,
      },
    })
    .from(paymentsTable)
    .innerJoin(classesTable, eq(paymentsTable.classId, classesTable.id))
    .where(paymentWhere(filters))
    .orderBy(desc(paymentsTable.date), desc(paymentsTable.id))
    .limit(pagination.pageSize)
    .offset(pagination.pageIndex * pagination.pageSize);
}

export function buildPaymentSummaryQuery(filters: PaymentFilters) {
  return db
    .select({
      rowCount: sql<number>`count(*)`.mapWith(Number),
      totalAmount:
        sql<number>`COALESCE(SUM(${paymentsTable.amount}), 0)`.mapWith(Number),
      paidAmount:
        sql<number>`COALESCE(SUM(CASE WHEN ${paymentsTable.status} = 'paid' THEN ${paymentsTable.amount} ELSE 0 END), 0)`.mapWith(
          Number
        ),
      pendingAmount:
        sql<number>`COALESCE(SUM(CASE WHEN ${paymentsTable.status} = 'pending' THEN ${paymentsTable.amount} ELSE 0 END), 0)`.mapWith(
          Number
        ),
      cancelledAmount:
        sql<number>`COALESCE(SUM(CASE WHEN ${paymentsTable.status} = 'cancelled' THEN ${paymentsTable.amount} ELSE 0 END), 0)`.mapWith(
          Number
        ),
    })
    .from(paymentsTable)
    .innerJoin(classesTable, eq(paymentsTable.classId, classesTable.id))
    .where(paymentWhere(filters));
}
