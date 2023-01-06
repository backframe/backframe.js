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
var unique_exports = {};
__export(unique_exports, {
  unique: () => unique
});
module.exports = __toCommonJS(unique_exports);
function unique(arr) {
  const { length } = arr;
  const result = [];
  const seen = /* @__PURE__ */ new Set();
  loop:
    for (let i = 0; i < length; i++) {
      const value = arr[i];
      if (seen.has(value)) {
        continue loop;
      }
      seen.add(value);
      result.push(value);
    }
  return result;
}
__name(unique, "unique");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  unique
});
