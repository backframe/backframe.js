"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var migrateEngineCommands_exports = {};
__export(migrateEngineCommands_exports, {
  MigrateEngineExitCode: () => MigrateEngineExitCode,
  canConnectToDatabase: () => canConnectToDatabase,
  createDatabase: () => createDatabase,
  dropDatabase: () => dropDatabase,
  execaCommand: () => execaCommand
});
module.exports = __toCommonJS(migrateEngineCommands_exports);
var import_fetch_engine = require("@prisma/fetch-engine");
var import_execa = __toESM(require("execa"));
var import_fs = __toESM(require("fs"));
var import_util = require("util");
var import_resolveBinary = require("./resolveBinary");
const exists = (0, import_util.promisify)(import_fs.default.exists);
var MigrateEngineExitCode = /* @__PURE__ */ ((MigrateEngineExitCode2) => {
  MigrateEngineExitCode2[MigrateEngineExitCode2["Success"] = 0] = "Success";
  MigrateEngineExitCode2[MigrateEngineExitCode2["Error"] = 1] = "Error";
  MigrateEngineExitCode2[MigrateEngineExitCode2["Panic"] = 101] = "Panic";
  return MigrateEngineExitCode2;
})(MigrateEngineExitCode || {});
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
__name(parseJsonFromStderr, "parseJsonFromStderr");
async function canConnectToDatabase(connectionString, cwd = process.cwd(), migrationEnginePath) {
  if (!connectionString) {
    throw new Error("Connection url is empty. See https://www.prisma.io/docs/reference/database-reference/connection-urls");
  }
  try {
    await execaCommand({
      connectionString,
      cwd,
      migrationEnginePath,
      engineCommandName: "can-connect-to-database"
    });
  } catch (_e) {
    const e = _e;
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
__name(canConnectToDatabase, "canConnectToDatabase");
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
  } catch (_e) {
    const e = _e;
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
__name(createDatabase, "createDatabase");
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
__name(dropDatabase, "dropDatabase");
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
  } catch (_e) {
    const e = _e;
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
__name(execaCommand, "execaCommand");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MigrateEngineExitCode,
  canConnectToDatabase,
  createDatabase,
  dropDatabase,
  execaCommand
});
