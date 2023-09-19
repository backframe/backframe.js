import { DrizzleAdapter } from "@backframe/adapter-drizzle";
import { defineConfig } from "@backframe/core";
import { db } from "./src/db.js";
import { posts } from "./src/schema.js";

const database = new DrizzleAdapter("pg", db, [{ key: "posts", table: posts }]);

export default defineConfig({
  interfaces: {
    rest: {},
  },
  database,
});
