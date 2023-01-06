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
var loadEnvFile_exports = {};
__export(loadEnvFile_exports, {
  loadEnvFile: () => loadEnvFile
});
module.exports = __toCommonJS(loadEnvFile_exports);
var import_getEnvPaths = require("./getEnvPaths");
var import_tryLoadEnvs = require("./tryLoadEnvs");
function loadEnvFile(schemaPath, print = false) {
  const envPaths = (0, import_getEnvPaths.getEnvPaths)(schemaPath);
  const envData = (0, import_tryLoadEnvs.tryLoadEnvs)(envPaths, { conflictCheck: "error" });
  if (print && envData && envData.message) {
    console.info(envData.message);
  }
}
__name(loadEnvFile, "loadEnvFile");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  loadEnvFile
});
