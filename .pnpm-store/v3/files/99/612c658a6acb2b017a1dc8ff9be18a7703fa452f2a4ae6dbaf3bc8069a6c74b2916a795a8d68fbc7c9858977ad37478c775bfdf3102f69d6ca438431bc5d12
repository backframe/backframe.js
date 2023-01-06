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
var getConfig_exports = {};
__export(getConfig_exports, {
  GetConfigError: () => GetConfigError,
  getConfig: () => getConfig
});
module.exports = __toCommonJS(getConfig_exports);
var import_debug = __toESM(require("@prisma/debug"));
var import_engines = require("@prisma/engines");
var import_fetch_engine = require("@prisma/fetch-engine");
var import_chalk = __toESM(require("chalk"));
var import_execa = __toESM(require("execa"));
var E = __toESM(require("fp-ts/Either"));
var import_function = require("fp-ts/lib/function");
var TE = __toESM(require("fp-ts/TaskEither"));
var import_ts_pattern = require("ts-pattern");
var import_panic = require("../panic");
var import_errorHelpers = require("./errorHelpers");
var import_queryEngineCommons = require("./queryEngineCommons");
const debug = (0, import_debug.default)("prisma:getConfig");
const MAX_BUFFER = 1e9;
class GetConfigError extends Error {
  constructor(params) {
    const headline = import_chalk.default.redBright.bold("Get Config: ");
    const constructedErrorMessage = (0, import_ts_pattern.match)(params).with({ _tag: "parsed" }, ({ errorCode, message, reason }) => {
      const errorCodeMessage = errorCode ? `Error code: ${errorCode}` : "";
      return `${reason}
${errorCodeMessage}
${message}`;
    }).with({ _tag: "unparsed" }, ({ message, reason }) => {
      const detailsHeader = import_chalk.default.red.bold("Details:");
      return `${reason}
${detailsHeader} ${message}`;
    }).exhaustive();
    super((0, import_errorHelpers.addVersionDetailsToErrorMessage)(`${headline}${constructedErrorMessage}`));
  }
}
__name(GetConfigError, "GetConfigError");
async function getConfig(options) {
  const cliEngineBinaryType = (0, import_engines.getCliQueryEngineBinaryType)();
  const data = await (0, import_ts_pattern.match)(cliEngineBinaryType).with(import_fetch_engine.BinaryType.libqueryEngine, () => {
    return getConfigNodeAPI(options);
  }).with(import_fetch_engine.BinaryType.queryEngine, () => {
    return getConfigBinary(options);
  }).exhaustive();
  return data;
}
__name(getConfig, "getConfig");
async function getConfigNodeAPI(options) {
  const debugErrorType = (0, import_queryEngineCommons.createDebugErrorType)(debug, "getConfigNodeAPI");
  const preliminaryEither = await (0, import_queryEngineCommons.preliminaryNodeAPIPipeline)(options)();
  if (E.isLeft(preliminaryEither)) {
    const { left: e } = preliminaryEither;
    debugErrorType(e);
    throw new GetConfigError({ _tag: "unparsed", message: e.error.message, reason: e.reason });
  }
  const { queryEnginePath } = preliminaryEither.right;
  debug(`Using CLI Query Engine (Node-API Library) at: ${queryEnginePath}`);
  const pipeline = (0, import_function.pipe)((0, import_queryEngineCommons.loadNodeAPILibrary)(queryEnginePath), TE.chainW(({ NodeAPIQueryEngineLibrary }) => {
    debug("Loaded Node-API Library");
    return TE.tryCatch(() => {
      var _a;
      if (process.env.FORCE_PANIC_QUERY_ENGINE_GET_CONFIG) {
        debug("Triggering a Rust panic...");
        return NodeAPIQueryEngineLibrary.debugPanic("FORCE_PANIC_QUERY_ENGINE_GET_CONFIG");
      }
      const data = NodeAPIQueryEngineLibrary.getConfig({
        datamodel: options.datamodel,
        datasourceOverrides: {},
        ignoreEnvVarErrors: (_a = options.ignoreEnvVarErrors) != null ? _a : false,
        env: process.env
      });
      return Promise.resolve(data);
    }, (e) => ({
      type: "node-api",
      reason: "Error while interacting with query-engine-node-api library",
      error: e
    }));
  }));
  const configEither = await pipeline();
  if (E.isRight(configEither)) {
    debug("config data retrieved without errors in getConfigNodeAPI");
    const { right: data } = configEither;
    return data;
  }
  const error = (0, import_ts_pattern.match)(configEither.left).with({ type: "node-api" }, (e) => {
    debugErrorType(e);
    const errorOutput = e.error.message;
    const actualError = (0, import_function.pipe)(E.tryCatch(() => JSON.parse(errorOutput), () => {
      debug(`Coudln't apply JSON.parse to "${errorOutput}"`);
      return new GetConfigError({ _tag: "unparsed", message: errorOutput, reason: e.reason });
    }), E.map((errorOutputAsJSON) => {
      if (errorOutputAsJSON.is_panic) {
        const panic = new import_panic.RustPanic(errorOutputAsJSON.message, errorOutputAsJSON.backtrace || e.error.stack || "NO_BACKTRACE", "query-engine-node-api get-config", import_panic.ErrorArea.QUERY_ENGINE_LIBRARY_CLI, options.prismaPath, void 0);
        debug(`panic in getConfigNodeAPI "${e.type}"`, panic);
        return panic;
      }
      const { error_code: errorCode } = errorOutputAsJSON;
      return new GetConfigError({
        _tag: "parsed",
        message: errorOutputAsJSON.message,
        reason: `${import_chalk.default.redBright.bold("Schema parsing")} - ${e.reason}`,
        errorCode
      });
    }), E.getOrElseW(import_function.identity));
    return actualError;
  }).otherwise((e) => {
    debugErrorType(e);
    return new GetConfigError({ _tag: "unparsed", message: e.error.message, reason: e.reason });
  });
  throw error;
}
__name(getConfigNodeAPI, "getConfigNodeAPI");
async function getConfigBinary(options) {
  const debugErrorType = (0, import_queryEngineCommons.createDebugErrorType)(debug, "getConfigBinary");
  const preliminaryEither = await (0, import_queryEngineCommons.preliminaryBinaryPipeline)(options)();
  if (E.isLeft(preliminaryEither)) {
    const { left: e } = preliminaryEither;
    debugErrorType(e);
    throw new GetConfigError({ _tag: "unparsed", message: e.error.message, reason: e.reason });
  }
  const { queryEnginePath, tempDatamodelPath } = preliminaryEither.right;
  debug(`Using CLI Query Engine (Binary) at: ${queryEnginePath}`);
  debug(`PRISMA_DML_PATH: ${tempDatamodelPath}`);
  const pipeline = (0, import_function.pipe)((() => {
    const execaOptions = {
      cwd: options.cwd,
      env: {
        PRISMA_DML_PATH: tempDatamodelPath,
        RUST_BACKTRACE: "1"
      },
      maxBuffer: MAX_BUFFER
    };
    const engineArgs = [];
    const args = options.ignoreEnvVarErrors ? ["--ignoreEnvVarErrors"] : [];
    return TE.tryCatch(() => {
      if (process.env.FORCE_PANIC_QUERY_ENGINE_GET_CONFIG) {
        debug("Triggering a Rust panic...");
        return (0, import_execa.default)(queryEnginePath, [...engineArgs, "cli", "debug-panic", "--message", "FORCE_PANIC_QUERY_ENGINE_GET_CONFIG"], execaOptions);
      }
      return (0, import_execa.default)(queryEnginePath, [...engineArgs, "cli", "get-config", ...args], execaOptions);
    }, (e) => ({
      type: "execa",
      reason: "Error while interacting with query-engine binary",
      error: e
    }));
  })(), TE.map((result) => ({ result })), TE.chainW(({ result }) => {
    return (0, import_function.pipe)(E.tryCatch(() => JSON.parse(result.stdout), (e) => ({
      type: "parse-json",
      reason: "Unable to parse JSON",
      error: e
    })), TE.fromEither);
  }));
  const configEither = await pipeline();
  if (E.isRight(configEither)) {
    debug("config data retrieved without errors in getConfigBinary");
    await (0, import_queryEngineCommons.unlinkTempDatamodelPath)(options, tempDatamodelPath)();
    const { right: data } = configEither;
    return data;
  }
  const error = (0, import_ts_pattern.match)(configEither.left).with({ type: "execa" }, (e) => {
    var _a, _b;
    debugErrorType(e);
    if ((0, import_panic.isExecaErrorCausedByRustPanic)(e.error)) {
      const panic = new import_panic.RustPanic(e.error.shortMessage, e.error.stderr, "query-engine get-config", import_panic.ErrorArea.QUERY_ENGINE_BINARY_CLI, (_a = options.datamodelPath) != null ? _a : tempDatamodelPath, void 0);
      debug(`panic in getConfigBinary "${e.type}"`, panic);
      return panic;
    }
    const errorOutput = (_b = e.error.stderr) != null ? _b : e.error.stdout;
    const actualError = (0, import_function.pipe)(E.tryCatch(() => JSON.parse(errorOutput), () => {
      debug(`Coudln't apply JSON.parse to "${errorOutput}"`);
      return new GetConfigError({ _tag: "unparsed", message: errorOutput, reason: e.reason });
    }), E.map((errorOutputAsJSON) => {
      const defaultMessage = import_chalk.default.redBright(errorOutputAsJSON.message);
      const getConfigErrorInit = (0, import_ts_pattern.match)(errorOutputAsJSON).with({ error_code: "P1012" }, (eJSON) => {
        return {
          reason: `${import_chalk.default.redBright.bold("Schema parsing")} - ${e.reason}`,
          errorCode: eJSON.error_code
        };
      }).with({ error_code: import_ts_pattern.P.string }, (eJSON) => {
        return {
          reason: e.reason,
          errorCode: eJSON.error_code
        };
      }).otherwise(() => {
        return {
          reason: e.reason
        };
      });
      return new GetConfigError({ _tag: "parsed", message: defaultMessage, ...getConfigErrorInit });
    }), E.getOrElse(import_function.identity));
    return actualError;
  }).otherwise((e) => {
    debugErrorType(e);
    return new GetConfigError({ _tag: "unparsed", message: e.error.message, reason: e.reason });
  });
  throw error;
}
__name(getConfigBinary, "getConfigBinary");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GetConfigError,
  getConfig
});
