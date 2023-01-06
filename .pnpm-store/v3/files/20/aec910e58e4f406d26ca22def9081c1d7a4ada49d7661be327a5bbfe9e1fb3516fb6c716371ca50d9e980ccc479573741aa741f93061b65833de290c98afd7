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
var queryEngineCommons_exports = {};
__export(queryEngineCommons_exports, {
  createDebugErrorType: () => createDebugErrorType,
  loadNodeAPILibrary: () => loadNodeAPILibrary,
  preliminaryBinaryPipeline: () => preliminaryBinaryPipeline,
  preliminaryNodeAPIPipeline: () => preliminaryNodeAPIPipeline,
  unlinkTempDatamodelPath: () => unlinkTempDatamodelPath
});
module.exports = __toCommonJS(queryEngineCommons_exports);
var import_fetch_engine = require("@prisma/fetch-engine");
var import_get_platform = require("@prisma/get-platform");
var E = __toESM(require("fp-ts/Either"));
var import_function = require("fp-ts/lib/function");
var TE = __toESM(require("fp-ts/TaskEither"));
var import_fs = __toESM(require("fs"));
var import_temp_write = __toESM(require("temp-write"));
var import_ts_pattern = require("ts-pattern");
var import_resolveBinary = require("../resolveBinary");
var import_load = require("../utils/load");
function preliminaryNodeAPIPipeline(options) {
  return (0, import_function.pipe)(TE.tryCatch(() => (0, import_resolveBinary.resolveBinary)(import_fetch_engine.BinaryType.libqueryEngine, options.prismaPath), (e) => ({
    type: "query-engine-unresolved",
    reason: "Unable to resolve path to query-engine binary",
    error: e
  })), TE.chainW((queryEnginePath) => {
    return (0, import_function.pipe)(TE.tryCatch(import_get_platform.isNodeAPISupported, (e) => ({
      type: "node-api-not-supported",
      reason: "The query-engine library is not supported on this platform",
      error: e
    })), TE.map((_) => ({ queryEnginePath })));
  }));
}
__name(preliminaryNodeAPIPipeline, "preliminaryNodeAPIPipeline");
function preliminaryBinaryPipeline(options) {
  return (0, import_function.pipe)(TE.tryCatch(() => (0, import_resolveBinary.resolveBinary)(import_fetch_engine.BinaryType.queryEngine, options.prismaPath), (e) => ({
    type: "query-engine-unresolved",
    reason: "Unable to resolve path to query-engine binary",
    error: e
  })), TE.map((queryEnginePath) => ({ queryEnginePath })), TE.chainW(({ queryEnginePath }) => {
    if (!options.datamodelPath) {
      return (0, import_function.pipe)(TE.tryCatch(() => (0, import_temp_write.default)(options.datamodel), (e) => ({
        type: "datamodel-write",
        reason: "Unable to write temp data model path",
        error: e
      })), TE.map((tempDatamodelPath) => ({ queryEnginePath, tempDatamodelPath })));
    }
    return TE.right({
      queryEnginePath,
      tempDatamodelPath: options.datamodelPath
    });
  }));
}
__name(preliminaryBinaryPipeline, "preliminaryBinaryPipeline");
function loadNodeAPILibrary(queryEnginePath) {
  return (0, import_function.pipe)(E.tryCatch(() => (0, import_load.load)(queryEnginePath), (e) => {
    const error = e;
    const defaultErrorMessage = `Unable to establish a connection to query-engine-node-api library.`;
    const proposedErrorFixMessage = (0, import_ts_pattern.match)(error.message).when((errMessage) => errMessage.includes("openssl"), () => {
      return ` It seems there is a problem with your OpenSSL installation!`;
    }).otherwise(() => "");
    const reason = `${defaultErrorMessage}${proposedErrorFixMessage}`;
    return {
      type: "connection-error",
      reason,
      error
    };
  }), TE.fromEither, TE.map((NodeAPIQueryEngineLibrary) => ({ NodeAPIQueryEngineLibrary })));
}
__name(loadNodeAPILibrary, "loadNodeAPILibrary");
function unlinkTempDatamodelPath(options, tempDatamodelPath) {
  return TE.tryCatch(() => {
    if (!options.datamodelPath && tempDatamodelPath) {
      return import_fs.default.promises.unlink(tempDatamodelPath);
    }
    return Promise.resolve(void 0);
  }, (e) => ({
    type: "unlink-temp-datamodel-path",
    reason: "Unable to delete temporary datamodel path",
    error: e
  }));
}
__name(unlinkTempDatamodelPath, "unlinkTempDatamodelPath");
const createDebugErrorType = /* @__PURE__ */ __name((debug, fnName) => ({ type, reason, error }) => {
  debug(`error of type "${type}" in ${fnName}:
`, { reason, error });
}, "createDebugErrorType");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createDebugErrorType,
  loadNodeAPILibrary,
  preliminaryBinaryPipeline,
  preliminaryNodeAPIPipeline,
  unlinkTempDatamodelPath
});
