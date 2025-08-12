"use server";

import { ClassSessionDataType } from "@/app/class-sessions/components/form/schema";
import { db } from "@/db";
import { PaymentStatus } from "@/enums";
import { SessionStatus } from "@/enums/session-status";
import { classSessionsTable } from "@/schemas/class-sessions";
import { classesTable } from "@/schemas/classes";
import { paymentsTable } from "@/schemas/payments";
import { eq, getTableColumns, sql } from "drizzle-orm";

import {
  makeActionError,
  makeActionListSuccess,
  makeActionSuccess,
} from "./utils";

export async function createClassSession(data: ClassSessionDataType) {
  try {
    const [newClassSession] = await db
      .insert(classSessionsTable)
      .values({
        date: new Date(data.date),
        classId: data.classId,
        fee: data.fee,
        notes: data.notes,
      })
      .returning();

    return makeActionSuccess(newClassSession);
  } catch (error) {
    console.error("Error creating class session:", error);

    if (error instanceof Error) {
      return makeActionError(error.message);
    }

    return makeActionError("Failed to create class session");
  }
}

export const updateClassSession = async (
  id: string,
  data: Partial<ClassSessionDataType>
) => {
  try {
    const updateData: Partial<
      Omit<ClassSessionDataType, "date"> & {
        date: Date;
      }
    > = {};
    if (data.date) {
      updateData.date = new Date(data.date);
    }
    if (data.classId) {
      updateData.classId = data.classId;
    }
    if (data.fee) {
      updateData.fee = data.fee;
    }
    if (data.notes) {
      updateData.notes = data.notes;
    }
    const [updatedClassSession] = await db
      .update(classSessionsTable)
      .set(updateData)
      .where(eq(classSessionsTable.id, id))
      .returning();

    return makeActionSuccess(updatedClassSession);
  } catch (error) {
    console.error("Error updating class session:", error);

    if (error instanceof Error) {
      return makeActionError(error.message);
    }

    return makeActionError("Failed to update class session");
  }
};

export const deleteClassSession = async (id: string) => {
  try {
    // make soft delete
    const [deletedClassSession] = await db
      .update(classSessionsTable)
      .set({
        deletedAt: new Date(),
        isDeleted: true,
        updatedAt: new Date(),
      })
      .where(eq(classSessionsTable.id, id))
      .returning();

    return makeActionSuccess(deletedClassSession);
  } catch (error) {
    console.error("Error deleting class session:", error);

    if (error instanceof Error) {
      return makeActionError(error.message);
    }

    return makeActionError("Failed to delete class session");
  }
};

export const getClassSessions = async () => {
  try {
    const classSessions = await db
      .select({
        rowCount: sql<number>`count(*) over()`.mapWith(Number),
        ...getTableColumns(classSessionsTable),
        class: {
          name: classesTable.name,
          code: classesTable.code,
          color: classesTable.color,
        },
      })
      .from(classSessionsTable)
      .innerJoin(classesTable, eq(classSessionsTable.classId, classesTable.id))
      .where(eq(classSessionsTable.isDeleted, false));

    return makeActionListSuccess({
      rows: classSessions,
      rowCount: classSessions.length > 0 ? classSessions[0].rowCount : 0,
    });
  } catch (error) {
    console.error("Error fetching class sessions:", error);
    if (error instanceof Error) {
      return makeActionError(error.message);
    }

    return makeActionError("Failed to fetch class sessions");
  }
};

export const finishClassSession = async (id: string) => {
  try {
    // First, get the current session to check its status and get the fee
    const [currentSession] = await db
      .select()
      .from(classSessionsTable)
      .where(eq(classSessionsTable.id, id))
      .limit(1);

    if (!currentSession) {
      return makeActionError("Class session not found");
    }

    if (currentSession.status !== SessionStatus.PLANNED) {
      return makeActionError("Only planned sessions can be marked as finished");
    }

    // Use a transaction to ensure both operations succeed or fail together
    const result = await db.batch([
      db
        .update(classSessionsTable)
        .set({
          status: SessionStatus.FINISHED,
        })
        .where(eq(classSessionsTable.id, id))
        .returning(),

      db
        .insert(paymentsTable)
        .values({
          date: new Date(),
          classId: currentSession.classId,
          sessionId: id,
          amount: currentSession.fee,
          status: PaymentStatus.PENDING,
          notes: `Payment for session on ${new Date(currentSession.date).toLocaleDateString()}`,
        })
        .returning(),
    ]);

    return makeActionSuccess({
      updatedSession: result[0][0],
      newPayment: result[1][0],
    });
  } catch (error) {
    console.error("Error finishing class session:", error);

    if (error instanceof Error) {
      return makeActionError(error.message);
    }

    return makeActionError("Failed to finish class session");
  }
};
