import { PrismaAdapter } from "@backframe/adapter-prisma";
import { defineConfig } from "@backframe/core";
import { PrismaClient } from "@bf/database";

const client = new PrismaClient();
const database = new PrismaAdapter(client);

export default defineConfig({
  interfaces: {
    rest: {},
  },
  database,
});
