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
var getDmmf_exports = {};
__export(getDmmf_exports, {
  GetDmmfError: () => GetDmmfError,
  getDMMF: () => getDMMF
});
module.exports = __toCommonJS(getDmmf_exports);
var import_debug = __toESM(require("@prisma/debug"));
var import_engines = require("@prisma/engines");
var import_fetch_engine = require("@prisma/fetch-engine");
var import_chalk = __toESM(require("chalk"));
var import_execa = __toESM(require("execa"));
var E = __toESM(require("fp-ts/Either"));
var import_function = require("fp-ts/lib/function");
var TE = __toESM(require("fp-ts/TaskEither"));
var import_fs = __toESM(require("fs"));
var import_ts_pattern = require("ts-pattern");
var import_panic = require("../panic");
var import_errorHelpers = require("./errorHelpers");
var import_queryEngineCommons = require("./queryEngineCommons");
const debug = (0, import_debug.default)("prisma:getDMMF");
const MAX_BUFFER = 1e9;
class GetDmmfError extends Error {
  constructor(params) {
    const headline = import_chalk.default.redBright.bold("Get DMMF: ");
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
__name(GetDmmfError, "GetDmmfError");
async function getDMMF(options) {
  warnOnDeprecatedFeatureFlag(options.previewFeatures);
  const cliEngineBinaryType = (0, import_engines.getCliQueryEngineBinaryType)();
  const dmmf = await (0, import_ts_pattern.match)(cliEngineBinaryType).with(import_fetch_engine.BinaryType.libqueryEngine, () => {
    return getDmmfNodeAPI(options);
  }).with(import_fetch_engine.BinaryType.queryEngine, () => {
    return getDmmfBinary(options);
  }).exhaustive();
  return dmmf;
}
__name(getDMMF, "getDMMF");
async function getDmmfNodeAPI(options) {
  const debugErrorType = (0, import_queryEngineCommons.createDebugErrorType)(debug, "getDmmfNodeAPI");
  const preliminaryEither = await (0, import_queryEngineCommons.preliminaryNodeAPIPipeline)(options)();
  if (E.isLeft(preliminaryEither)) {
    const { left: e } = preliminaryEither;
    debugErrorType(e);
    throw new GetDmmfError({ _tag: "unparsed", message: e.error.message, reason: e.reason });
  }
  const { queryEnginePath } = preliminaryEither.right;
  debug(`Using CLI Query Engine (Node-API Library) at: ${queryEnginePath}`);
  const pipeline = (0, import_function.pipe)((0, import_queryEngineCommons.loadNodeAPILibrary)(queryEnginePath), TE.chainW(({ NodeAPIQueryEngineLibrary }) => {
    debug("Loaded Node-API Library");
    return (0, import_function.pipe)(TE.tryCatch(() => {
      if (options.datamodel) {
        return Promise.resolve(options.datamodel);
      }
      return import_fs.default.promises.readFile(options.datamodelPath, "utf-8");
    }, (e) => ({
      type: "read-datamodel-path",
      reason: "Error while trying to read datamodel path",
      error: e,
      datamodelPath: options.datamodelPath
    })), TE.map((datamodel) => ({ NodeAPIQueryEngineLibrary, datamodel })));
  }), TE.chainW(({ NodeAPIQueryEngineLibrary, datamodel }) => {
    return (0, import_function.pipe)(TE.tryCatch(() => {
      if (process.env.FORCE_PANIC_QUERY_ENGINE_GET_DMMF) {
        debug("Triggering a Rust panic...");
        return NodeAPIQueryEngineLibrary.debugPanic("FORCE_PANIC_QUERY_ENGINE_GET_DMMF");
      }
      const result = NodeAPIQueryEngineLibrary.dmmf(datamodel);
      return Promise.resolve(result);
    }, (e) => ({
      type: "node-api",
      reason: "Error while interacting with query-engine-node-api library",
      error: e,
      datamodel
    })), TE.map((result) => ({ result })));
  }), TE.chainW(({ result }) => {
    debug("unserialized dmmf result ready");
    return (0, import_function.pipe)(E.tryCatch(() => JSON.parse(result), (e) => ({
      type: "parse-json",
      reason: "Unable to parse JSON",
      error: e
    })), TE.fromEither);
  }));
  const dmmfEither = await pipeline();
  if (E.isRight(dmmfEither)) {
    debug("dmmf retrieved without errors in getDmmfNodeAPI");
    const { right: dmmf } = dmmfEither;
    return dmmf;
  }
  const error = (0, import_ts_pattern.match)(dmmfEither.left).with({ type: "node-api" }, (e) => {
    debugErrorType(e);
    const errorOutput = e.error.message;
    const actualError = (0, import_function.pipe)(E.tryCatch(() => JSON.parse(errorOutput), () => {
      debug(`Coudln't apply JSON.parse to "${errorOutput}"`);
      return new GetDmmfError({ _tag: "unparsed", message: errorOutput, reason: e.reason });
    }), E.map((errorOutputAsJSON) => {
      if (errorOutputAsJSON.is_panic) {
        const panic = new import_panic.RustPanic(errorOutputAsJSON.message, errorOutputAsJSON.backtrace || e.error.stack || "NO_BACKTRACE", "query-engine-node-api get-dmmf", import_panic.ErrorArea.QUERY_ENGINE_LIBRARY_CLI, options.prismaPath, e.datamodel);
        debug(`panic in getDmmfNodeAPI "${e.type}"`, panic);
        return panic;
      }
      const defaultMessage = addMissingOpenSSLInfo(errorOutputAsJSON.message);
      const { error_code: errorCode } = errorOutputAsJSON;
      return new GetDmmfError({
        _tag: "parsed",
        message: defaultMessage,
        reason: `${import_chalk.default.redBright.bold("Schema parsing")} - ${e.reason}`,
        errorCode
      });
    }), E.getOrElseW(import_function.identity));
    return actualError;
  }).otherwise((e) => {
    debugErrorType(e);
    return new GetDmmfError({ _tag: "unparsed", message: e.error.message, reason: e.reason });
  });
  throw error;
}
__name(getDmmfNodeAPI, "getDmmfNodeAPI");
async function getDmmfBinary(options) {
  var _a;
  const debugErrorType = (0, import_queryEngineCommons.createDebugErrorType)(debug, "getDmmfBinary");
  const preliminaryEither = await (0, import_queryEngineCommons.preliminaryBinaryPipeline)(options)();
  if (E.isLeft(preliminaryEither)) {
    const { left: e } = preliminaryEither;
    debugErrorType(e);
    throw new GetDmmfError({ _tag: "unparsed", message: e.error.message, reason: e.reason });
  }
  const { queryEnginePath, tempDatamodelPath } = preliminaryEither.right;
  debug(`Using CLI Query Engine (Binary) at: ${queryEnginePath}`);
  debug(`PRISMA_DML_PATH: ${tempDatamodelPath}`);
  const pipeline = (0, import_function.pipe)((() => {
    const execaOptions = {
      cwd: options.cwd,
      env: {
        PRISMA_DML_PATH: tempDatamodelPath,
        RUST_BACKTRACE: "1",
        ...process.env.NO_COLOR ? {} : { CLICOLOR_FORCE: "1" }
      },
      maxBuffer: MAX_BUFFER
    };
    const args = ["--enable-raw-queries", "cli", "dmmf"];
    return TE.tryCatch(() => {
      if (process.env.FORCE_PANIC_QUERY_ENGINE_GET_DMMF) {
        debug("Triggering a Rust panic...");
        return (0, import_execa.default)(queryEnginePath, ["cli", "debug-panic", "--message", "FORCE_PANIC_QUERY_ENGINE_GET_DMMF"], execaOptions);
      }
      return (0, import_execa.default)(queryEnginePath, args, execaOptions);
    }, (e) => ({
      type: "execa",
      reason: "Error while interacting with query-engine binary",
      error: e
    }));
  })(), TE.map((result) => {
    const shouldRetry2 = result.stdout.includes("Please wait until the") && options.retry && options.retry > 0;
    return { result, shouldRetry: shouldRetry2 };
  }), TE.chainW(({ result, shouldRetry: shouldRetry2 }) => {
    if (shouldRetry2) {
      return TE.left({
        type: "retry",
        reason: 'Retrying after "Please wait until"',
        timeout: 5e3
      });
    }
    return TE.right({ result });
  }), TE.chainW(({ result }) => {
    const firstCurly = result.stdout.indexOf("{");
    const stdout = result.stdout.slice(firstCurly);
    return (0, import_function.pipe)(E.tryCatch(() => JSON.parse(stdout), (e) => ({
      type: "parse-json",
      reason: "Unable to parse JSON",
      error: e,
      result
    })), TE.fromEither);
  }));
  const dmmfEither = await pipeline();
  if (E.isRight(dmmfEither)) {
    debug("dmmf retrieved without errors in getDmmfBinary");
    await (0, import_queryEngineCommons.unlinkTempDatamodelPath)(options, tempDatamodelPath)();
    const { right: dmmf } = dmmfEither;
    return dmmf;
  }
  const errorEither = (0, import_ts_pattern.match)(dmmfEither.left).with({ type: "execa" }, (e) => {
    var _a2, _b;
    debugErrorType(e);
    if (e.error.message.includes("Command failed with exit code 26 (ETXTBSY)") && options.retry && options.retry > 0) {
      return E.left({
        type: "retry",
        reason: 'Retrying because of error "ETXTBSY"',
        timeout: 500
      });
    }
    if ((0, import_panic.isExecaErrorCausedByRustPanic)(e.error)) {
      const panic = new import_panic.RustPanic(e.error.shortMessage, e.error.stderr, "query-engine get-dmmf", import_panic.ErrorArea.QUERY_ENGINE_BINARY_CLI, (_a2 = options.datamodelPath) != null ? _a2 : tempDatamodelPath, void 0);
      debug(`panic in getDmmfBinary "${e.type}"`, panic);
      return E.right(panic);
    }
    const errorOutput = (_b = e.error.stderr) != null ? _b : e.error.stdout;
    const actualError = (0, import_function.pipe)(E.tryCatch(() => JSON.parse(errorOutput), () => {
      debug(`Coudln't apply JSON.parse to "${errorOutput}"`);
      return new GetDmmfError({ _tag: "unparsed", message: errorOutput, reason: e.reason });
    }), E.map((errorOutputAsJSON) => {
      const defaultMessage = addMissingOpenSSLInfo(`${import_chalk.default.redBright(errorOutputAsJSON.message)}`);
      const { error_code: errorCode } = errorOutputAsJSON;
      return new GetDmmfError({
        _tag: "parsed",
        message: defaultMessage,
        reason: `${import_chalk.default.redBright.bold("Schema parsing")} - ${e.reason}`,
        errorCode
      });
    }), E.getOrElse(import_function.identity));
    return E.right(actualError);
  }).with({ type: "parse-json" }, (e) => {
    var _a2;
    debugErrorType(e);
    const message = `Problem while parsing the query engine response at ${queryEnginePath}. ${e.result.stdout}
${(_a2 = e.error) == null ? void 0 : _a2.stack}`;
    const error = new GetDmmfError({
      _tag: "unparsed",
      message,
      reason: `${import_chalk.default.redBright.bold("JSON parsing")} - ${e.reason}
`
    });
    return E.right(error);
  }).with({ type: "retry" }, (e) => {
    return E.left(e);
  }).exhaustive();
  const shouldRetry = E.isLeft(errorEither);
  if (!shouldRetry) {
    throw errorEither.right;
  }
  const { timeout: retryTimeout, reason: retryReason } = errorEither.left;
  debug(`Waiting "${retryTimeout}" seconds before retrying...`);
  await new Promise((resolve) => setTimeout(resolve, retryTimeout));
  debug(retryReason);
  return getDmmfBinary({ ...options, retry: ((_a = options.retry) != null ? _a : 0) - 1 });
}
__name(getDmmfBinary, "getDmmfBinary");
function addMissingOpenSSLInfo(message) {
  if (message.includes("debian-openssl-1.1.x: error while loading shared libraries: libssl.so.1.1: cannot open shared object file: No such file or directory") || message.includes("debian-openssl-1.0.x: error while loading shared libraries: libssl.so.1.0.0: cannot open shared object file: No such file or directory")) {
    message += `
${import_chalk.default.green(`Your linux installation misses the openssl package. You can install it like so:
`)}${import_chalk.default.green.bold("apt-get -qy update && apt-get -qy install openssl")}`;
  }
  return message;
}
__name(addMissingOpenSSLInfo, "addMissingOpenSSLInfo");
function warnOnDeprecatedFeatureFlag(previewFeatures) {
  const getMessage = /* @__PURE__ */ __name((flag) => `${import_chalk.default.blueBright("info")} The preview flag "${flag}" is not needed anymore, please remove it from your schema.prisma`, "getMessage");
  const removedFeatureFlagMap = {
    insensitiveFilters: getMessage("insensitiveFilters"),
    atomicNumberOperations: getMessage("atomicNumberOperations"),
    connectOrCreate: getMessage("connectOrCreate"),
    transaction: getMessage("transaction"),
    nApi: getMessage("nApi"),
    transactionApi: getMessage("transactionApi"),
    uncheckedScalarInputs: getMessage("uncheckedScalarInputs"),
    nativeTypes: getMessage("nativeTypes"),
    createMany: getMessage("createMany"),
    groupBy: getMessage("groupBy"),
    referentialActions: getMessage("referentialActions"),
    microsoftSqlServer: getMessage("microsoftSqlServer"),
    selectRelationCount: getMessage("selectRelationCount"),
    orderByRelation: getMessage("orderByRelation"),
    orderByAggregateGroup: getMessage("orderByAggregateGroup")
  };
  previewFeatures == null ? void 0 : previewFeatures.forEach((f) => {
    const removedMessage = removedFeatureFlagMap[f];
    if (removedMessage && !process.env.PRISMA_HIDE_PREVIEW_FLAG_WARNINGS) {
      console.warn(removedMessage);
    }
  });
}
__name(warnOnDeprecatedFeatureFlag, "warnOnDeprecatedFeatureFlag");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GetDmmfError,
  getDMMF
});
