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
var panic_exports = {};
__export(panic_exports, {
  ErrorArea: () => ErrorArea,
  RustPanic: () => RustPanic,
  isExecaErrorCausedByRustPanic: () => isExecaErrorCausedByRustPanic,
  isRustPanic: () => isRustPanic
});
module.exports = __toCommonJS(panic_exports);
class RustPanic extends Error {
  constructor(message, rustStack, request, area, schemaPath, schema, introspectionUrl) {
    super(message);
    this.__typename = "RustPanic";
    this.rustStack = rustStack;
    this.request = request;
    this.area = area;
    this.schemaPath = schemaPath;
    this.schema = schema;
    this.introspectionUrl = introspectionUrl;
  }
}
__name(RustPanic, "RustPanic");
function isRustPanic(e) {
  return e.__typename === "RustPanic";
}
__name(isRustPanic, "isRustPanic");
var ErrorArea = /* @__PURE__ */ ((ErrorArea2) => {
  ErrorArea2["LIFT_CLI"] = "LIFT_CLI";
  ErrorArea2["PHOTON_STUDIO"] = "PHOTON_STUDIO";
  ErrorArea2["INTROSPECTION_CLI"] = "INTROSPECTION_CLI";
  ErrorArea2["FMT_CLI"] = "FMT_CLI";
  ErrorArea2["QUERY_ENGINE_BINARY_CLI"] = "QUERY_ENGINE_BINARY_CLI";
  ErrorArea2["QUERY_ENGINE_LIBRARY_CLI"] = "QUERY_ENGINE_LIBRARY_CLI";
  return ErrorArea2;
})(ErrorArea || {});
function isExecaErrorCausedByRustPanic(error) {
  var _a;
  return error.exitCode === 101 || ((_a = error.stderr) == null ? void 0 : _a.includes("panicked at"));
}
__name(isExecaErrorCausedByRustPanic, "isExecaErrorCausedByRustPanic");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ErrorArea,
  RustPanic,
  isExecaErrorCausedByRustPanic,
  isRustPanic
});
