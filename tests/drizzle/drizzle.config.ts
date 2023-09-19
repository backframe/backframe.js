import type { Config } from "drizzle-kit";

export default {
  schema: "./src/schema.ts",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.PG_DATABASE_URL!,
  }
} satisfies Config;
