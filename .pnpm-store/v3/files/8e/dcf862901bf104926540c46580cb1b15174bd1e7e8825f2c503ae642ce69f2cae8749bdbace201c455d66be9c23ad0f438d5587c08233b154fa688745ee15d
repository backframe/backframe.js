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
var flatMap_exports = {};
__export(flatMap_exports, {
  flatMap: () => flatMap
});
module.exports = __toCommonJS(flatMap_exports);
function flatten(array) {
  return Array.prototype.concat.apply([], array);
}
__name(flatten, "flatten");
function flatMap(array, callbackFn, thisArg) {
  return flatten(array.map(callbackFn, thisArg));
}
__name(flatMap, "flatMap");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  flatMap
});
