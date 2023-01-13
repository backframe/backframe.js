import sdk from "@prisma/sdk";
import path from "path";
import { dmmfModelsdeserializer, Model } from "prisma-schema-transformer";
import { fileURLToPath } from "url";
const { getDMMF } = sdk;

type Database =
  | "mongodb"
  | "cockroachdb"
  | "sqlite"
  | "postgres"
  | "sqlserver"
  | "sqlite";

type Opts = {
  auth: boolean;
  admin: boolean;
  analytics: boolean;
  logs: boolean;
  database: Database;
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function getPrismaHeader(db: string) {
  return `
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "${db}"
  url      = env("DATABASE_URL")
}
`.trim();
}

export async function generateSchema(opts: Opts) {
  const file = opts.database === "mongodb" ? "mongo.prisma" : "sql.prisma";
  const dmmf = await getDMMF({
    datamodelPath: path.join(__dirname, "..", `models/${file}`),
  });

  // transform dmmf
  dmmf.datamodel.models = dmmf.datamodel.models.filter((m) => {
    if (m.name.startsWith("Auth")) {
      return opts.auth;
    }
    if (m.name.startsWith("Admin")) {
      return opts.admin;
    }
    if (m.name.startsWith("Analytics")) {
      return opts.analytics;
    }
    if (m.name.startsWith("Logs")) {
      return opts.logs;
    }
    return true;
  });

  const modelsSchema = await dmmfModelsdeserializer(
    dmmf.datamodel.models as unknown as Model[]
  );

  // generate schema
  const schema = `${getPrismaHeader(opts.database)}\n${modelsSchema}`;
  // search-replace empty lines
  return schema.replace(/(\r?\n)(?:\r?\n)+/g, "$1");
}

console.log(
  await generateSchema({
    auth: true,
    admin: true,
    database: "mongodb",
    analytics: true,
    logs: true,
  })
);
