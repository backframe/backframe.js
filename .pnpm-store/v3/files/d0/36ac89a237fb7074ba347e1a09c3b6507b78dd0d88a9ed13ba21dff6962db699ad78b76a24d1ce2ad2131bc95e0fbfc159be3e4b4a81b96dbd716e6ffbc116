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
var serializeQueryEngineName_exports = {};
__export(serializeQueryEngineName_exports, {
  serializeQueryEngineName: () => serializeQueryEngineName
});
module.exports = __toCommonJS(serializeQueryEngineName_exports);
function serializeQueryEngineName(message) {
  const normalizedName = "query-engine-NORMALIZED";
  if (process.env.PRISMA_CLI_QUERY_ENGINE_TYPE === "binary") {
    return message.replace(/query-engine binary/g, normalizedName);
  }
  return message.replace(/query-engine-node-api library/g, normalizedName);
}
__name(serializeQueryEngineName, "serializeQueryEngineName");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  serializeQueryEngineName
});
