var __defProp = Object.defineProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
__export(exports, {
  mapPreviewFeatures: () => mapPreviewFeatures
});
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  mapPreviewFeatures
});
