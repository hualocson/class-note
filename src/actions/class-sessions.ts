"use server";

import { ClassSessionDataType } from "@/app/(protected)/class-sessions/components/form/schema";
import dayjs from "@/configs/dayjs";
import { db } from "@/db";
import { PaymentStatus } from "@/enums";
import { SessionStatus } from "@/enums/session-status";
import { classSessionsTable } from "@/schemas/class-sessions";
import { classesTable } from "@/schemas/classes";
import { paymentsTable } from "@/schemas/payments";
import { and, asc, between, eq, getTableColumns, sql } from "drizzle-orm";

import {
  makeActionError,
  makeActionListSuccess,
  makeActionSuccess,
} from "./utils";

export async function createClassSession(data: ClassSessionDataType) {
  try {
    // Parse the date string from VN timezone and convert to UTC for server storage
    const sessionDate = new Date(data.date);

    const [newClassSession] = await db
      .insert(classSessionsTable)
      .values({
        date: sessionDate,
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

interface IGetClassSessions {
  date: string;
}

export const getClassSessions = async (query?: IGetClassSessions) => {
  try {
    // Calculate first time and last time of the day in local timezone

    if (query?.date) {
      // Parse dd/MM/YYYY explicitly in VN timezone
      const startOfDay = dayjs(query.date);

      // plus to 23:59:59
      const endOfDay = startOfDay
        .add(23, "hour")
        .add(59, "minute")
        .add(59, "second");

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
        .innerJoin(
          classesTable,
          eq(classSessionsTable.classId, classesTable.id)
        )
        .where(
          and(
            eq(classSessionsTable.isDeleted, false),
            startOfDay && endOfDay
              ? between(
                  classSessionsTable.date,
                  startOfDay.toDate(),
                  endOfDay.toDate()
                )
              : undefined
          )
        )
        .orderBy(asc(classSessionsTable.status), asc(classSessionsTable.date));

      return makeActionListSuccess({
        rows: classSessions,
        rowCount: classSessions.length > 0 ? classSessions[0].rowCount : 0,
      });
    }

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
      .where(and(eq(classSessionsTable.isDeleted, false)))
      .orderBy(asc(classSessionsTable.status), asc(classSessionsTable.date));

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

    const clientDate = dayjs(currentSession.date).tz("Asia/Ho_Chi_Minh");

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
          notes: `Payment for session on ${clientDate.format("DD/MM/YYYY HH:mm")}`,
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
