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
var getVersion_exports = {};
__export(getVersion_exports, {
  getVersion: () => getVersion
});
module.exports = __toCommonJS(getVersion_exports);
var import_debug = __toESM(require("@prisma/debug"));
var import_engines = require("@prisma/engines");
var import_fetch_engine = require("@prisma/fetch-engine");
var import_get_platform = require("@prisma/get-platform");
var import_execa = __toESM(require("execa"));
var import_resolveBinary = require("../resolveBinary");
var import_load = require("../utils/load");
const debug = (0, import_debug.default)("prisma:getVersion");
const MAX_BUFFER = 1e9;
async function getVersion(enginePath, binaryName) {
  if (!binaryName) {
    binaryName = (0, import_engines.getCliQueryEngineBinaryType)();
  }
  enginePath = await (0, import_resolveBinary.resolveBinary)(binaryName, enginePath);
  if (binaryName === import_fetch_engine.BinaryType.libqueryEngine) {
    await (0, import_get_platform.isNodeAPISupported)();
    const QE = (0, import_load.load)(enginePath);
    return `libquery-engine ${QE.version().commit}`;
  } else {
    const result = await (0, import_execa.default)(enginePath, ["--version"], {
      maxBuffer: MAX_BUFFER
    });
    return result.stdout;
  }
}
__name(getVersion, "getVersion");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getVersion
});
