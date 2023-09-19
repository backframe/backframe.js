import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";
import * as schema from "./schema.js";
const { Client } = pkg;

const client = new Client({
  connectionString: process.env.PG_DATABASE_URL,
});

await client.connect();
export const db = drizzle(client, { schema });
