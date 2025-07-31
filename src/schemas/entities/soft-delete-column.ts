import type { ColumnDataType } from "drizzle-orm";
import type { ColumnBaseConfig } from "drizzle-orm/column";
import {
  type ExtraConfigColumn,
  boolean,
  index,
  timestamp,
} from "drizzle-orm/pg-core";
export const softDeleteColumns = {
  isDeleted: boolean("is_deleted").notNull().default(false),
  deletedAt: timestamp("deleted_at", {
    withTimezone: true,
  }),
};

export const softDeleteColumnsIndex = (t: {
  isDeleted: ExtraConfigColumn<ColumnBaseConfig<ColumnDataType, string>>;
}) => index().on(t.isDeleted);