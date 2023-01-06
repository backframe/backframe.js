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
var warnOnce_exports = {};
__export(warnOnce_exports, {
  warnOnce: () => warnOnce
});
module.exports = __toCommonJS(warnOnce_exports);
var import_logger = require("./logger");
const alreadyWarned = /* @__PURE__ */ new Set();
const warnOnce = /* @__PURE__ */ __name((key, message, ...args) => {
  if (!alreadyWarned.has(key)) {
    alreadyWarned.add(key);
    (0, import_logger.warn)(message, ...args);
  }
}, "warnOnce");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  warnOnce
});
