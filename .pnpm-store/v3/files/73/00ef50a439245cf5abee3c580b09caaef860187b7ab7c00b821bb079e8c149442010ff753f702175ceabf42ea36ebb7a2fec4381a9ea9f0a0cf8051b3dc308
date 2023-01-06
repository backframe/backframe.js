"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var binaryTypeToEngineType_exports = {};
__export(binaryTypeToEngineType_exports, {
  binaryTypeToEngineType: () => binaryTypeToEngineType
});
module.exports = __toCommonJS(binaryTypeToEngineType_exports);
var import_fetch_engine = require("@prisma/fetch-engine");
function binaryTypeToEngineType(binaryType) {
  if (binaryType === import_fetch_engine.BinaryType.introspectionEngine) {
    return "introspectionEngine";
  }
  if (binaryType === import_fetch_engine.BinaryType.migrationEngine) {
    return "migrationEngine";
  }
  if (binaryType === import_fetch_engine.BinaryType.libqueryEngine) {
    return "libqueryEngine";
  }
  if (binaryType === import_fetch_engine.BinaryType.queryEngine) {
    return "queryEngine";
  }
  if (binaryType === import_fetch_engine.BinaryType.prismaFmt) {
    return "prismaFmt";
  }
  throw new Error(`Could not convert binary type ${binaryType}`);
}
__name(binaryTypeToEngineType, "binaryTypeToEngineType");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  binaryTypeToEngineType
});
