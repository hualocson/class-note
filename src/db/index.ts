import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";

config({ path: ".env.local" });

const url = process.env.DATABASE_URL!;

const sql = neon(url);
export const db = drizzle({
  client: sql,
  casing: "snake_case", // Use snake_case for database column names
});
