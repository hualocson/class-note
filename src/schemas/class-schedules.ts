import { Weekday } from "@/enums";
import { relations } from "drizzle-orm";
import { date, jsonb, pgTable, text, uuid } from "drizzle-orm/pg-core";

import { classesTable } from "./classes";
import { timestampColumns } from "./entities/timestamp-columns";

export const classSchedulesTable = pgTable("class_schedules", {
  id: uuid().primaryKey().defaultRandom(),
  classId: uuid()
    .notNull()
    .references(() => classesTable.id, { onDelete: "cascade" }),

  startDate: date({ mode: "date" }).notNull(), // start date apply this schedule
  endDate: date({ mode: "date" }), // end date apply this schedule default is null
  rrule: text().notNull(), // rrule string
  // JSON mapping weekdays to times
  weeklyTimes: jsonb()
    .$type<Record<Weekday, { start: string; end: string }>>()
    .notNull(),
  ...timestampColumns,
});

export const classSchedulesRelations = relations(
  classSchedulesTable,
  ({ one }) => ({
    class: one(classesTable, {
      fields: [classSchedulesTable.classId],
      references: [classesTable.id],
    }),
  })
);

export type SelectClassScheduleType = typeof classSchedulesTable.$inferSelect;
export type InsertClassScheduleType = typeof classSchedulesTable.$inferInsert;
