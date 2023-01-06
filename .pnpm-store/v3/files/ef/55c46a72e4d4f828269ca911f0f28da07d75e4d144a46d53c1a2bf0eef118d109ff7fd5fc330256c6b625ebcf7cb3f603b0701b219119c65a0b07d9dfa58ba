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
var checkFeatureFlags_exports = {};
__export(checkFeatureFlags_exports, {
  checkFeatureFlags: () => checkFeatureFlags
});
module.exports = __toCommonJS(checkFeatureFlags_exports);
var import_forbiddenItxWithProxyFlagMessage = require("./forbiddenItxWithProxyFlagMessage");
function checkFeatureFlags(config, options) {
  checkForbiddenItxWithDataProxyFlag(config, options);
}
__name(checkFeatureFlags, "checkFeatureFlags");
function checkForbiddenItxWithDataProxyFlag(config, options) {
  options.dataProxy === true && config.generators.some((generatorConfig) => {
    return generatorConfig.previewFeatures.some((feature) => {
      if (feature.toLocaleLowerCase() === "metrics".toLocaleLowerCase()) {
        throw new Error((0, import_forbiddenItxWithProxyFlagMessage.forbiddenPreviewFeatureWithDataProxyFlagMessage)("metrics"));
      }
      if (feature.toLocaleLowerCase() === "interactiveTransactions".toLocaleLowerCase()) {
        throw new Error((0, import_forbiddenItxWithProxyFlagMessage.forbiddenPreviewFeatureWithDataProxyFlagMessage)("interactiveTransactions"));
      }
    });
  });
}
__name(checkForbiddenItxWithDataProxyFlag, "checkForbiddenItxWithDataProxyFlag");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  checkFeatureFlags
});
