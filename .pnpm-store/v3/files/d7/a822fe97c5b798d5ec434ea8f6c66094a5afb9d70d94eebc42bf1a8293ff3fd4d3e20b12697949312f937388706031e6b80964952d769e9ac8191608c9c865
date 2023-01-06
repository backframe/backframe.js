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
var mapKeys_exports = {};
__export(mapKeys_exports, {
  mapKeys: () => mapKeys
});
module.exports = __toCommonJS(mapKeys_exports);
function mapKeys(obj, mapper) {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    acc[mapper(key)] = value;
    return acc;
  }, {});
}
__name(mapKeys, "mapKeys");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  mapKeys
});
