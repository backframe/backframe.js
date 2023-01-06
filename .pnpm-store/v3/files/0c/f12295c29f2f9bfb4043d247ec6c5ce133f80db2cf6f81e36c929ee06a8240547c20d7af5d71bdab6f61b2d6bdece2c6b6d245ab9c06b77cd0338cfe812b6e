var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};
__export(exports, {
  Debug: () => Debug,
  default: () => Debug,
  getLogs: () => getLogs
});
var import_debug = __toModule(require("debug"));
var import_node = __toModule(require("./node"));
const cache = [];
const MAX_LOGS = 100;
function Debug(namespace) {
  const debug = (0, import_node.default)(namespace, (...args) => {
    cache.push(args);
    if (cache.length > MAX_LOGS) {
      cache.shift();
    }
  });
  return debug;
}
Debug.enable = (namespace) => {
  import_node.default.enable(namespace);
};
Debug.enabled = (namespace) => import_node.default.enabled(namespace);
function getLogs(numChars = 7500) {
  const output = cache.map((c) => c.map((item) => {
    if (typeof item === "string") {
      return item;
    }
    return JSON.stringify(item);
  }).join("  ")).join("\n");
  if (output.length < numChars) {
    return output;
  }
  return output.slice(-numChars);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Debug,
  getLogs
});
