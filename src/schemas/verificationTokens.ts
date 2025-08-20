import { pgTable, primaryKey, text, timestamp } from "drizzle-orm/pg-core";

export const verificationTokensTable = pgTable(
  "verification_tokens",
  {
    identifier: text().notNull(),
    token: text().notNull(),
    expires: timestamp({ withTimezone: true }).notNull(),
  },
  (table) => [
    {
      compoundKey: primaryKey({
        columns: [table.identifier, table.token],
      }),
    },
  ]
);

export type SelectVerificationTokenType =
  typeof verificationTokensTable.$inferSelect;
export type InsertVerificationTokenType =
  typeof verificationTokensTable.$inferInsert;
