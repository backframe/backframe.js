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
var mapPreviewFeatures_exports = {};
__export(mapPreviewFeatures_exports, {
  mapPreviewFeatures: () => mapPreviewFeatures
});
module.exports = __toCommonJS(mapPreviewFeatures_exports);
const featureFlagMap = {
  transactionApi: "transaction",
  aggregateApi: "aggregations"
};
function mapPreviewFeatures(features) {
  if (Array.isArray(features) && features.length > 0) {
    return features.map((f) => {
      var _a;
      return (_a = featureFlagMap[f]) != null ? _a : f;
    });
  }
  return [];
}
__name(mapPreviewFeatures, "mapPreviewFeatures");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  mapPreviewFeatures
});
