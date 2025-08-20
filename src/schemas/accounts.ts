import type { AdapterAccountType } from "@auth/core/adapters";
import { relations } from "drizzle-orm";
import { integer, pgTable, primaryKey, text, uuid } from "drizzle-orm/pg-core";

import { usersTable } from "./users";

export const accountsTable = pgTable(
  "accounts",
  {
    userId: uuid("userId")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    type: text().$type<AdapterAccountType>().notNull(),
    provider: text().notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (table) => [
    {
      compoundKey: primaryKey({
        columns: [table.provider, table.providerAccountId],
      }),
    },
  ]
);

export const accountsRelations = relations(accountsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [accountsTable.userId],
    references: [usersTable.id],
  }),
}));

export type SelectAccountType = typeof accountsTable.$inferSelect;
export type InsertAccountType = typeof accountsTable.$inferInsert;
