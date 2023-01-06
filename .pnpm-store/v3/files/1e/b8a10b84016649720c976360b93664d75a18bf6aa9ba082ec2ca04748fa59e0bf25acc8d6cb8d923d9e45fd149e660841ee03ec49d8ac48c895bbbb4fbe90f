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
var src_exports = {};
__export(src_exports, {
  Debug: () => Debug,
  default: () => src_default,
  getLogs: () => getLogs
});
module.exports = __toCommonJS(src_exports);
var import_debug = __toESM(require("debug"));
const MAX_LOGS = 100;
const debugArgsHistory = [];
function debugCall(namespace) {
  const debugNamespace = (0, import_debug.default)(namespace);
  const call = Object.assign((...args) => {
    debugNamespace.log = call.log;
    if (args.length !== 0) {
      debugArgsHistory.push([namespace, ...args]);
    }
    if (debugArgsHistory.length > MAX_LOGS) {
      debugArgsHistory.shift();
    }
    return debugNamespace("", ...args);
  }, debugNamespace);
  return call;
}
__name(debugCall, "debugCall");
const Debug = Object.assign(debugCall, import_debug.default);
function getLogs(numChars = 7500) {
  const output = debugArgsHistory.map((c) => c.map((item) => {
    if (typeof item === "string") {
      return item;
    }
    return JSON.stringify(item);
  }).join(" ")).join("\n");
  if (output.length < numChars) {
    return output;
  }
  return output.slice(-numChars);
}
__name(getLogs, "getLogs");
var src_default = Debug;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Debug,
  getLogs
});
