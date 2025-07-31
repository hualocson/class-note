import { relations } from "drizzle-orm";
import { pgTable, uuid, timestamp, text, integer, date, index, bigint } from "drizzle-orm/pg-core";
import { classesTable } from "./classes";
import { timestampColumns } from "./entities/timestamp-columns";

export const paymentsTable = pgTable("payments", {
  id: uuid().primaryKey().defaultRandom(),
  date: date().notNull(),
  classId: uuid().notNull().references(() => classesTable.id, { onDelete: "restrict" }),
  amount: bigint({ mode: "number" }).notNull(), // Store as 180000, 130000 (VND)
  status: text().default("paid").notNull(), // 'paid', 'pending', 'cancelled'
  notes: text(),
  ...timestampColumns,
}, (table) => ([
  index("payments_date_idx").on(table.date),
  index("payments_class_date_idx").on(table.classId, table.date),
  index("payments_status_idx").on(table.status),
]));

// Define relations
export const paymentsRelations = relations(paymentsTable, ({ one }) => ({
  class: one(classesTable, {
    fields: [paymentsTable.classId],
    references: [classesTable.id],
  }),
}));

// TypeScript types
export type SelectPayment = typeof paymentsTable.$inferSelect;
export type InsertPayment = typeof paymentsTable.$inferInsert;