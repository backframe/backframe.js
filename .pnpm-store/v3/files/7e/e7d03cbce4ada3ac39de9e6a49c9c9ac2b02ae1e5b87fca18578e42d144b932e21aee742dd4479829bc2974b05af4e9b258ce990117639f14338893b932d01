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
  GetConfigError: () => GetConfigError,
  getConfig: () => getConfig
});
var import_debug = __toModule(require("@prisma/debug"));
var import_engines = __toModule(require("@prisma/engines"));
var import_fetch_engine = __toModule(require("@prisma/fetch-engine"));
var import_get_platform = __toModule(require("@prisma/get-platform"));
var import_chalk = __toModule(require("chalk"));
var import_execa = __toModule(require("execa"));
var import_fs = __toModule(require("fs"));
var import_temp_write = __toModule(require("temp-write"));
var import_util = __toModule(require("util"));
var import_resolveBinary = __toModule(require("../resolveBinary"));
var import_load = __toModule(require("../utils/load"));
const debug = (0, import_debug.default)("prisma:getConfig");
const unlink = (0, import_util.promisify)(import_fs.default.unlink);
const MAX_BUFFER = 1e9;
class GetConfigError extends Error {
  constructor(message) {
    super(import_chalk.default.redBright.bold("Get config: ") + message);
  }
}
async function getConfig(options) {
  var _a, _b;
  const cliEngineBinaryType = (0, import_engines.getCliQueryEngineBinaryType)();
  let data;
  if (cliEngineBinaryType === import_fetch_engine.BinaryType.libqueryEngine) {
    data = await getConfigNodeAPI(options);
  } else {
    data = await getConfigBinary(options);
  }
  if (!data)
    throw new GetConfigError(`Failed to return any data`);
  if (((_b = (_a = data.datasources) == null ? void 0 : _a[0]) == null ? void 0 : _b.provider) === "sqlite" && data.generators.some((g) => g.previewFeatures.includes("createMany"))) {
    const message = `Database provider "sqlite" and the preview feature "createMany" can't be used at the same time.
  Please either remove the "createMany" feature flag or use any other database type that Prisma supports: postgres, mysql or sqlserver.`;
    throw new GetConfigError(message);
  }
  return data;
}
async function getConfigNodeAPI(options) {
  var _a;
  let data;
  const queryEnginePath = await (0, import_resolveBinary.resolveBinary)(import_fetch_engine.BinaryType.libqueryEngine, options.prismaPath);
  await (0, import_get_platform.isNodeAPISupported)();
  debug(`Using Node-API Query Engine at: ${queryEnginePath}`);
  try {
    const NodeAPIQueryEngineLibrary = (0, import_load.load)(queryEnginePath);
    data = await NodeAPIQueryEngineLibrary.getConfig({
      datamodel: options.datamodel,
      datasourceOverrides: {},
      ignoreEnvVarErrors: (_a = options.ignoreEnvVarErrors) != null ? _a : false,
      env: process.env
    });
  } catch (e) {
    let error;
    try {
      error = JSON.parse(e.message);
    } catch (e2) {
      throw e;
    }
    let message;
    if (error.error_code === "P1012") {
      message = import_chalk.default.redBright(`Schema Parsing ${error.error_code}

`) + error.message + "\n";
    } else {
      message = import_chalk.default.redBright(`${error.error_code}

`) + error;
    }
    throw new GetConfigError(message);
  }
  return data;
}
async function getConfigBinary(options) {
  let data;
  const queryEnginePath = await (0, import_resolveBinary.resolveBinary)(import_fetch_engine.BinaryType.queryEngine, options.prismaPath);
  debug(`Using Query Engine Binary at: ${queryEnginePath}`);
  try {
    let tempDatamodelPath = options.datamodelPath;
    if (!tempDatamodelPath) {
      try {
        tempDatamodelPath = await (0, import_temp_write.default)(options.datamodel);
      } catch (err) {
        throw new GetConfigError("Unable to write temp data model path");
      }
    }
    const engineArgs = [];
    const args = options.ignoreEnvVarErrors ? ["--ignoreEnvVarErrors"] : [];
    const result = await (0, import_execa.default)(queryEnginePath, [...engineArgs, "cli", "get-config", ...args], {
      cwd: options.cwd,
      env: {
        PRISMA_DML_PATH: tempDatamodelPath,
        RUST_BACKTRACE: "1"
      },
      maxBuffer: MAX_BUFFER
    });
    if (!options.datamodelPath) {
      await unlink(tempDatamodelPath);
    }
    data = JSON.parse(result.stdout);
  } catch (e) {
    if (e.stderr || e.stdout) {
      const error = e.stderr ? e.stderr : e.stout;
      let jsonError, message;
      try {
        jsonError = JSON.parse(error);
        message = `${import_chalk.default.redBright(jsonError.message)}
`;
        if (jsonError.error_code) {
          if (jsonError.error_code === "P1012") {
            message = import_chalk.default.redBright(`Schema Parsing ${jsonError.error_code}

`) + message;
          } else {
            message = import_chalk.default.redBright(`${jsonError.error_code}

`) + message;
          }
        }
      } catch (e2) {
        throw new GetConfigError(error);
      }
      throw new GetConfigError(message);
    }
    throw new GetConfigError(e);
  }
  return data;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GetConfigError,
  getConfig
});
