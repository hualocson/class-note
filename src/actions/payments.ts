"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/configs/auth.config";
import { db } from "@/db";
import {
  buildPaymentRowsQuery,
  buildPaymentSummaryQuery,
} from "@/db/queries/payments";
import { PaymentStatus } from "@/enums";
import {
  PaymentFilters,
  normalizePaymentFilters,
  parsePaymentPagination,
} from "@/lib/payment-filters";
import { classesTable } from "@/schemas/classes";
import { SelectPayment, paymentsTable } from "@/schemas/payments";
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

import { makeActionError, makeActionSuccess } from "./utils";

export interface CreatePaymentData {
  date: Date;
  classId: string;
  amount: number;
  status: PaymentStatus;
  notes?: string;
}

export type UpdatePaymentData = Partial<CreatePaymentData>;

export async function createPayment(
  data: CreatePaymentData
): Promise<ActionResponse<SelectPayment>> {
  try {
    // Insert the payment into the database
    const [newPayment] = await db
      .insert(paymentsTable)
      .values({
        date: new Date(data.date),
        classId: data.classId,
        amount: data.amount,
        status: data.status,
        notes: data.notes,
      })
      .returning();

    return makeActionSuccess(newPayment);
  } catch (error) {
    console.error("Error creating payment:", error);

    if (error instanceof Error) {
      return makeActionError(error.message);
    }

    return makeActionError("Failed to create payment");
  }
}

export async function updatePayment(
  id: string,
  data: UpdatePaymentData
): Promise<ActionResponse<SelectPayment>> {
  try {
    // Build the update object with only provided fields
    const updateData: UpdatePaymentData = {};

    if (data.date) {
      updateData.date = new Date(data.date);
    }
    if (data.classId) {
      updateData.classId = data.classId;
    }
    if (data.amount !== undefined) {
      updateData.amount = data.amount;
    }
    if (data.status) {
      updateData.status = data.status;
    }
    if (data.notes !== undefined) {
      updateData.notes = data.notes;
    }

    // Update the payment in the database
    const [updatedPayment] = await db
      .update(paymentsTable)
      .set(updateData)
      .where(eq(paymentsTable.id, id))
      .returning();

    if (!updatedPayment) {
      return makeActionError("Payment not found");
    }

    revalidatePath("/payments");

    return makeActionSuccess(updatedPayment);
  } catch (error) {
    console.error("Error updating payment:", error);

    if (error instanceof Error) {
      return makeActionError(error.message);
    }

    return makeActionError("Failed to update payment");
  }
}

export async function deletePayment(
  id: string
): Promise<ActionResponse<SelectPayment>> {
  try {
    const [deletedPayment] = await db
      .delete(paymentsTable)
      .where(eq(paymentsTable.id, id))
      .returning();

    if (!deletedPayment) {
      return makeActionError("Payment not found");
    }

    revalidatePath("/payments");

    return makeActionSuccess(deletedPayment);
  } catch (error) {
    console.error("Error deleting payment:", error);

    if (error instanceof Error) {
      return makeActionError(error.message);
    }

    return makeActionError("Failed to delete payment");
  }
}

interface IGetPaymentsParams {
  pagination?: {
    pageSize?: number;
    pageIndex?: number;
  };
  filters?: PaymentFilters;
}

export async function getPayments(params?: IGetPaymentsParams) {
  try {
    if (!(await auth())) {
      return makeActionError("Unauthorized");
    }
    const pagination = parsePaymentPagination(params?.pagination);
    const filters = normalizePaymentFilters(params?.filters);
    const rows = await buildPaymentRowsQuery(pagination, filters);
    return makeActionSuccess({ rows });
  } catch (error) {
    console.error("Error fetching payments:", error);

    if (error instanceof Error) {
      return makeActionError(error.message);
    }

    return makeActionError("Failed to fetch payments");
  }
}

export async function getPaymentById(
  id: string
): Promise<
  ActionResponse<
    SelectPayment & { class: { name: string; code: string | null } }
  >
> {
  try {
    const [payment] = await db
      .select({
        ...getTableColumns(paymentsTable),
        class: {
          name: classesTable.name,
          code: classesTable.code,
        },
      })
      .from(paymentsTable)
      .innerJoin(classesTable, eq(paymentsTable.classId, classesTable.id))
      .where(and(eq(paymentsTable.id, id), eq(classesTable.isDeleted, false)))
      .limit(1);

    if (!payment) {
      return makeActionError("Payment not found");
    }

    return makeActionSuccess(payment);
  } catch (error) {
    console.error("Error fetching payment:", error);

    if (error instanceof Error) {
      return makeActionError(error.message);
    }

    return makeActionError("Failed to fetch payment");
  }
}

export async function getPaymentStats(filters?: IGetPaymentsParams["filters"]) {
  try {
    if (!(await auth())) {
      return makeActionError("Unauthorized");
    }
    const [stats] = await buildPaymentSummaryQuery(
      normalizePaymentFilters(filters)
    );
    return makeActionSuccess(stats);
  } catch (error) {
    console.error("Error fetching payment stats:", error);

    if (error instanceof Error) {
      return makeActionError(error.message);
    }

    return makeActionError("Failed to fetch payment stats");
  }
}

interface IGetPaymentsClassStatsQuery {
  month?: string;
  status?: PaymentStatus;
}

export async function getPaymentsClassStats(
  query?: IGetPaymentsClassStatsQuery
) {
  const { month, status } = query ?? {
    month: new Date().toISOString().split("T")[0],
    status: PaymentStatus.PENDING,
  };
  try {
    // Calculate first day and last day of the month
    const monthDate = month ? new Date(month) : new Date();
    const firstDayOfMonth = new Date(
      monthDate.getFullYear(),
      monthDate.getMonth(),
      1
    );
    const lastDayOfMonth = new Date(
      monthDate.getFullYear(),
      monthDate.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    );

    const stats = await db
      .select({
        classId: paymentsTable.classId,
        className: classesTable.name,
        classCode: classesTable.code,
        classColor: classesTable.color,
        totalAmount: sql<number>`sum(${paymentsTable.amount})`.mapWith(Number),
      })
      .from(paymentsTable)
      .innerJoin(classesTable, eq(paymentsTable.classId, classesTable.id))
      .where(
        and(
          eq(classesTable.isDeleted, false),
          ...(status ? [eq(paymentsTable.status, status)] : []),
          gte(paymentsTable.date, firstDayOfMonth),
          lte(paymentsTable.date, lastDayOfMonth)
        )
      )
      .groupBy(
        paymentsTable.classId,
        classesTable.name,
        classesTable.code,
        classesTable.color
      )
      .orderBy(desc(sql`sum(${paymentsTable.amount})`));

    return makeActionSuccess(stats);
  } catch (error) {
    console.error("Error fetching payment class stats:", error);

    if (error instanceof Error) {
      return makeActionError(error.message);
    }

    return makeActionError("Failed to fetch payment class stats");
  }
}

export async function deletePayments(paymentIds: string[]) {
  try {
    const result = await db
      .delete(paymentsTable)
      .where(inArray(paymentsTable.id, paymentIds))
      .returning({
        id: paymentsTable.id,
      });

    return makeActionSuccess({
      deletedCount: result.length,
    });
  } catch (error) {
    console.error("Error deleting payments:", error);

    if (error instanceof Error) {
      return makeActionError(error.message);
    }

    return makeActionError("Failed to delete payments");
  }
}

export async function batchUpdatePaymentsStatus(
  paymentIds: string[],
  status: PaymentStatus
) {
  try {
    const result = await db
      .update(paymentsTable)
      .set({ status })
      .where(inArray(paymentsTable.id, paymentIds))
      .returning();

    return makeActionSuccess({
      updatedCount: result.length,
    });
  } catch (error) {
    console.error("Error updating payments status:", error);

    if (error instanceof Error) {
      return makeActionError(error.message);
    }

    return makeActionError("Failed to update payments status");
  }
}
