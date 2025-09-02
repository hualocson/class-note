"use server";

import { ClassScheduleDataType } from "@/app/(protected)/class-schedules/components/form/schema";
import dayjs from "@/configs/dayjs";
import { db } from "@/db";
import { Weekday } from "@/enums";
import { classSchedulesTable } from "@/schemas/class-schedules";
import { classSessionsTable } from "@/schemas/class-sessions";
import { classesTable } from "@/schemas/classes";
import { and, desc, eq, getTableColumns, inArray, sql } from "drizzle-orm";
import { RRule } from "rrule";

import {
  makeActionError,
  makeActionListSuccess,
  makeActionSuccess,
} from "./utils";

// this use for create new schedule for a class not have base week
export async function createNewSchedule(data: ClassScheduleDataType) {
  const { classId, rrule, startDate, endDate, weeklyTimes } = data;

  if (!weeklyTimes) {
    return makeActionError("Weekly times is required");
  }

  // Save new schedule
  await db
    .insert(classSchedulesTable)
    .values({
      classId,
      rrule,
      startDate,
      endDate,
      weeklyTimes,
    })
    .returning();

  return makeActionSuccess({
    created: 1,
  });
}

// get list schedule for all classes
export async function getListScheduleForAllClasses() {
  const schedules = await db
    .select({
      rowCount: sql<number>`count(*) over()`.mapWith(Number),
      ...getTableColumns(classSchedulesTable),
      class: {
        classId: classesTable.id,
        name: classesTable.name,
        code: classesTable.code,
        color: classesTable.color,
      },
    })
    .from(classSchedulesTable)
    .leftJoin(classesTable, eq(classSchedulesTable.classId, classesTable.id))
    .orderBy(desc(classSchedulesTable.createdAt))
    .where(eq(classesTable.isDeleted, false));

  return makeActionListSuccess({
    rows: schedules,
    rowCount: schedules?.[0]?.rowCount ?? 0,
  });
}

// update schedule
export async function updateSchedule(
  id: string,
  data: Partial<ClassScheduleDataType>
) {
  const [updated] = await db
    .update(classSchedulesTable)
    .set(data)
    .where(eq(classSchedulesTable.id, id))
    .returning();

  return makeActionSuccess({
    updated,
  });
}

// delete schedule
export async function deleteSchedule(id: string) {
  const [deleted] = await db
    .delete(classSchedulesTable)
    .where(eq(classSchedulesTable.id, id))
    .returning();

  return makeActionSuccess({
    deleted,
  });
}

// create bulk class session base on schedule
export async function createBulkClassSessionBaseOnSchedule(id: string) {
  const [schedule] = await db
    .select({
      ...getTableColumns(classSchedulesTable),
      class: {
        classId: classesTable.id,
        price: classesTable.price,
      },
    })
    .from(classSchedulesTable)
    .leftJoin(classesTable, eq(classSchedulesTable.classId, classesTable.id))
    .where(eq(classSchedulesTable.id, id))
    .limit(1);

  if (!schedule || !schedule.class) {
    return makeActionError("Schedule not found");
  }

  const { rrule, weeklyTimes, classId } = schedule;

  // start date is monday of current week and end date is sunday of current week
  const startDate = dayjs().startOf("week").startOf("day").toDate();
  const endDate = dayjs().endOf("week").endOf("day").toDate();

  const rruleParsed = RRule.fromString(rrule);
  const dates = rruleParsed
    .between(startDate, endDate, true)
    .map((date) => dayjs(date).format("YYYY-MM-DD"));

  // set time for each date , type of weeklyTimes is Record<Weekday, { start: string; end: string; }> start format is HH:mm and end format is HH:mm

  const datesWithTime = dates.map((date) => {
    const weekday = dayjs(date).format("dd").toUpperCase() as Weekday;

    const time = weeklyTimes[weekday];
    return dayjs(date)
      .set("hour", parseInt(time.start.split(":")[0]))
      .set("minute", parseInt(time.start.split(":")[1]))
      .set("second", 0)
      .set("millisecond", 0)
      .toDate();
  });

  // check if date is already exist in class sessions skip if exist else create new class session
  const query = db
    .select({
      date: classSessionsTable.date,
    })
    .from(classSessionsTable)
    .where(
      and(
        inArray(classSessionsTable.date, datesWithTime),
        eq(classSessionsTable.isDeleted, false),
        eq(classSessionsTable.classId, classId)
      )
    );

  const classSessions = await query.execute();

  // create new class session if date is not exist in class sessions
  const newClassSessions = datesWithTime.filter(
    (date) =>
      !classSessions.some(
        (session) =>
          dayjs(session.date).format("YYYY-MM-DD HH:mm") ===
          dayjs(date).format("YYYY-MM-DD HH:mm")
      )
  );

  if (newClassSessions.length > 0) {
    const insertData = newClassSessions.map((date) => ({
      date,
      classId: schedule.classId,
      fee: schedule.class?.price ?? 0,
      notes: `Created by schedule ${schedule.id}`,
    }));
    await db.insert(classSessionsTable).values(insertData);
  }

  return makeActionSuccess({
    created: newClassSessions.length,
  });
}
