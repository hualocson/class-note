import { bigint, boolean, index, integer, pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { timestampColumns } from "./entities/timestamp-columns";
import { relations } from "drizzle-orm";
import { paymentsTable } from "./payments";
import { softDeleteColumns, softDeleteColumnsIndex } from "./entities/soft-delete-column";

export const classesTable = pgTable("classes", {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  code: text(), // Optional code like 'C47', 'C28'
  color: text().default("#3b82f6"), // Hex color for UI
  price: bigint({ mode: "number" }).notNull(), // Store as 180000, 130000 (VND)
  sortOrder: integer().default(0),

  ...softDeleteColumns,
  ...timestampColumns,
}, (table) => ([
  uniqueIndex("classes_name_uidx").on(table.name),
  uniqueIndex("classes_code_uidx").on(table.code),
  index("classes_sort_idx").on(table.sortOrder, table.name),
  softDeleteColumnsIndex(table),
]));


export const classesRelations = relations(classesTable, ({ many }) => ({
  payments: many(paymentsTable),
}));


export type SelectClass = typeof classesTable.$inferSelect;
export type InsertClass = typeof classesTable.$inferInsert;
