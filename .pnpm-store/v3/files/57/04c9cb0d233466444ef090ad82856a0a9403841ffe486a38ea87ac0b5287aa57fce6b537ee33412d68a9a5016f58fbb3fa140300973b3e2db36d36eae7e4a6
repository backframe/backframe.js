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
var util_exports = {};
__export(util_exports, {
  removeISODate: () => removeISODate,
  sanitizeTestLogs: () => sanitizeTestLogs
});
module.exports = __toCommonJS(util_exports);
var import_strip_ansi = __toESM(require("strip-ansi"));
function removeISODate(str) {
  return str.replace(/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/gim, "");
}
__name(removeISODate, "removeISODate");
function sanitizeTestLogs(str) {
  return (0, import_strip_ansi.default)(str).split("\n").map((l) => removeISODate(l.replace(/\+\d+ms$/, "")).trim()).join("\n");
}
__name(sanitizeTestLogs, "sanitizeTestLogs");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  removeISODate,
  sanitizeTestLogs
});
