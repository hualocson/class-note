import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import {
  softDeleteColumns,
  softDeleteColumnsIndex,
} from "./entities/soft-delete-column";
import { timestampColumns } from "./entities/timestamp-columns";

export const usersTable = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text().notNull().unique(),
    name: text(),
    emailVerified: timestamp({ withTimezone: true }),
    image: text(),
    ...timestampColumns,
    ...softDeleteColumns,
  },
  (table) => [softDeleteColumnsIndex(table)]
);

export type SelectUserType = typeof usersTable.$inferSelect;
export type InsertUserType = typeof usersTable.$inferInsert;
