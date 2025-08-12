import { PaymentStatus } from "@/enums";
import { relations } from "drizzle-orm";
import {
  bigint,
  index,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { classSessionsTable } from "./class-sessions";
import { classesTable } from "./classes";
import { timestampColumns } from "./entities/timestamp-columns";
import { paymentStatusEnum } from "./enums";

export const paymentsTable = pgTable(
  "payments",
  {
    id: uuid().primaryKey().defaultRandom(),

    date: timestamp("date", { withTimezone: true }).notNull().defaultNow(),

    classId: uuid()
      .notNull()
      .references(() => classesTable.id, { onDelete: "restrict" }),

    sessionId: uuid().references(() => classSessionsTable.id, {
      onDelete: "set null",
    }), // Optional link to session

    amount: bigint({ mode: "number" }).notNull(), // VND

    status: paymentStatusEnum().default(PaymentStatus.PAID).notNull(),

    notes: text(),

    ...timestampColumns,
  },
  (table) => [
    index("payments_date_idx").on(table.date),
    index("payments_class_date_idx").on(table.classId, table.date),
    index("payments_status_idx").on(table.status),
  ]
);

// Define relations
export const paymentsRelations = relations(paymentsTable, ({ one }) => ({
  class: one(classesTable, {
    fields: [paymentsTable.classId],
    references: [classesTable.id],
  }),
  session: one(classSessionsTable, {
    fields: [paymentsTable.sessionId],
    references: [classSessionsTable.id],
  }),
}));

// TypeScript types
export type SelectPayment = typeof paymentsTable.$inferSelect;
export type InsertPayment = typeof paymentsTable.$inferInsert;
