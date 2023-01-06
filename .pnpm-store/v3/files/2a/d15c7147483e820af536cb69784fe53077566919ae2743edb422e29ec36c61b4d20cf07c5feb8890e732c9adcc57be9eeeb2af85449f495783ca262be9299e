var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};
__export(exports, {
  MigrateEngineExitCode: () => MigrateEngineExitCode,
  canConnectToDatabase: () => canConnectToDatabase,
  createDatabase: () => createDatabase,
  doesSqliteDbExist: () => doesSqliteDbExist,
  dropDatabase: () => dropDatabase,
  execaCommand: () => execaCommand
});
var import_fetch_engine = __toModule(require("@prisma/fetch-engine"));
var import_execa = __toModule(require("execa"));
var import_fs = __toModule(require("fs"));
var import_path = __toModule(require("path"));
var import_util = __toModule(require("util"));
var import_getSchema = __toModule(require("./cli/getSchema"));
var import_convertCredentials = __toModule(require("./convertCredentials"));
var import_resolveBinary = __toModule(require("./resolveBinary"));
const exists = (0, import_util.promisify)(import_fs.default.exists);
var MigrateEngineExitCode;
(function(MigrateEngineExitCode2) {
  MigrateEngineExitCode2[MigrateEngineExitCode2["Success"] = 0] = "Success";
  MigrateEngineExitCode2[MigrateEngineExitCode2["Error"] = 1] = "Error";
  MigrateEngineExitCode2[MigrateEngineExitCode2["Panic"] = 101] = "Panic";
})(MigrateEngineExitCode || (MigrateEngineExitCode = {}));
function parseJsonFromStderr(stderr) {
  const lines = stderr.split(/\r?\n/).slice(1);
  const logs = [];
  for (const line of lines) {
    const data = String(line);
    try {
      const json = JSON.parse(data);
      logs.push(json);
    } catch (e) {
      throw new Error(`Could not parse migration engine response: ${e}`);
    }
  }
  return logs;
}
async function canConnectToDatabase(connectionString, cwd = process.cwd(), migrationEnginePath) {
  if (!connectionString) {
    throw new Error("Connection url is empty. See https://www.prisma.io/docs/reference/database-reference/connection-urls");
  }
  const provider = (0, import_convertCredentials.protocolToConnectorType)(`${connectionString.split(":")[0]}:`);
  if (provider === "sqlite") {
    const sqliteExists = await doesSqliteDbExist(connectionString, cwd);
    if (sqliteExists) {
      return true;
    } else {
      return {
        code: "P1003",
        message: "SQLite database file doesn't exist"
      };
    }
  }
  try {
    await execaCommand({
      connectionString,
      cwd,
      migrationEnginePath,
      engineCommandName: "can-connect-to-database"
    });
  } catch (e) {
    if (e.stderr) {
      const logs = parseJsonFromStderr(e.stderr);
      const error = logs.find((it) => it.level === "ERROR" && it.target === "migration_engine::logger");
      if (error && error.fields.error_code && error.fields.message) {
        return {
          code: error.fields.error_code,
          message: error.fields.message
        };
      } else {
        throw new Error(`Migration engine error:
${logs.map((log) => log.fields.message).join("\n")}`);
      }
    } else {
      throw new Error(`Migration engine exited.`);
    }
  }
  return true;
}
async function createDatabase(connectionString, cwd = process.cwd(), migrationEnginePath) {
  const dbExists = await canConnectToDatabase(connectionString, cwd, migrationEnginePath);
  if (dbExists === true) {
    return false;
  }
  try {
    await execaCommand({
      connectionString,
      cwd,
      migrationEnginePath,
      engineCommandName: "create-database"
    });
    return true;
  } catch (e) {
    if (e.stderr) {
      const logs = parseJsonFromStderr(e.stderr);
      const error = logs.find((it) => it.level === "ERROR" && it.target === "migration_engine::logger");
      if (error && error.fields.error_code && error.fields.message) {
        throw new Error(`${error.fields.error_code}: ${error.fields.message}`);
      } else {
        throw new Error(`Migration engine error:
${logs.map((log) => log.fields.message).join("\n")}`);
      }
    } else {
      throw new Error(`Migration engine exited.`);
    }
  }
}
async function dropDatabase(connectionString, cwd = process.cwd(), migrationEnginePath) {
  try {
    const result = await execaCommand({
      connectionString,
      cwd,
      migrationEnginePath,
      engineCommandName: "drop-database"
    });
    if (result && result.exitCode === 0 && result.stderr.includes("The database was successfully dropped")) {
      return true;
    } else {
      throw Error(`An error occurred during the drop: ${JSON.stringify(result, void 0, 2)}`);
    }
  } catch (e) {
    if (e.stderr) {
      const logs = parseJsonFromStderr(e.stderr);
      throw new Error(`Migration engine error:
${logs.map((log) => log.fields.message).join("\n")}`);
    } else {
      throw new Error(`Migration engine exited.`);
    }
  }
}
async function execaCommand({
  connectionString,
  cwd,
  migrationEnginePath,
  engineCommandName
}) {
  migrationEnginePath = migrationEnginePath || await (0, import_resolveBinary.resolveBinary)(import_fetch_engine.BinaryType.migrationEngine);
  try {
    return await (0, import_execa.default)(migrationEnginePath, ["cli", "--datasource", connectionString, engineCommandName], {
      cwd,
      env: {
        RUST_BACKTRACE: "1",
        RUST_LOG: "info"
      }
    });
  } catch (e) {
    if (e.message) {
      e.message = e.message.replace(connectionString, "<REDACTED>");
    }
    if (e.stdout) {
      e.stdout = e.stdout.replace(connectionString, "<REDACTED>");
    }
    if (e.stderr) {
      e.stderr = e.stderr.replace(connectionString, "<REDACTED>");
    }
    throw e;
  }
}
async function doesSqliteDbExist(connectionString, schemaDir) {
  let filePath = connectionString;
  if (filePath.startsWith("file:")) {
    filePath = filePath.slice(5);
  } else if (filePath.startsWith("sqlite:")) {
    filePath = filePath.slice(7);
  }
  const cwd = schemaDir || await (0, import_getSchema.getSchemaDir)();
  if (!cwd) {
    throw new Error(`Could not find schema.prisma in ${process.cwd()}`);
  }
  const absoluteTarget = import_path.default.resolve(cwd, filePath);
  return exists(absoluteTarget);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MigrateEngineExitCode,
  canConnectToDatabase,
  createDatabase,
  doesSqliteDbExist,
  dropDatabase,
  execaCommand
});
