import { SessionStatus } from "@/enums";
import { relations } from "drizzle-orm";
import {
  bigint,
  index,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { classesTable } from "./classes";
import {
  softDeleteColumns,
  softDeleteColumnsIndex,
} from "./entities/soft-delete-column";
import { timestampColumns } from "./entities/timestamp-columns";
import { sessionStatusEnum } from "./enums";

export const classSessionsTable = pgTable(
  "class_sessions",
  {
    id: uuid().primaryKey().defaultRandom(),

    classId: uuid()
      .notNull()
      .references(() => classesTable.id, { onDelete: "cascade" }),

    date: timestamp("date", { withTimezone: true }).notNull(),

    fee: bigint({ mode: "number" }).notNull(), // Fee for this specific session

    status: sessionStatusEnum().default(SessionStatus.PLANNED).notNull(),

    notes: text().default(""),

    ...softDeleteColumns,
    ...timestampColumns,
  },
  (table) => [
    index("class_sessions_date_idx").on(table.date),
    index("class_sessions_class_date_idx").on(table.classId, table.date),
    softDeleteColumnsIndex(table),
  ]
);

export const classSessionsRelations = relations(
  classSessionsTable,
  ({ one }) => ({
    class: one(classesTable, {
      fields: [classSessionsTable.classId],
      references: [classesTable.id],
    }),
  })
);

export type SelectClassSessionType = typeof classSessionsTable.$inferSelect;
export type InsertClassSessionType = typeof classSessionsTable.$inferInsert;
