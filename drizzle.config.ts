import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import { config } from "dotenv";

config({ path: ".env.local" });

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

const outFolder = "./drizzle";

console.log("Using out folder:", outFolder);

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schemas/*",
  out: outFolder,
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
  casing: "snake_case",
});
