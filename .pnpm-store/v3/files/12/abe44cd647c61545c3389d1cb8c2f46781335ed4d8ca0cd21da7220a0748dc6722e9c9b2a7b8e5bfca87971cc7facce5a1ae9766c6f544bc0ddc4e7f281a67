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
var getClientEngineType_exports = {};
__export(getClientEngineType_exports, {
  ClientEngineType: () => ClientEngineType,
  DEFAULT_CLIENT_ENGINE_TYPE: () => DEFAULT_CLIENT_ENGINE_TYPE,
  getClientEngineType: () => getClientEngineType
});
module.exports = __toCommonJS(getClientEngineType_exports);
var ClientEngineType = /* @__PURE__ */ ((ClientEngineType2) => {
  ClientEngineType2["Library"] = "library";
  ClientEngineType2["Binary"] = "binary";
  return ClientEngineType2;
})(ClientEngineType || {});
const DEFAULT_CLIENT_ENGINE_TYPE = "library" /* Library */;
function getClientEngineType(generatorConfig) {
  const engineTypeFromEnvVar = getEngineTypeFromEnvVar();
  if (engineTypeFromEnvVar)
    return engineTypeFromEnvVar;
  if ((generatorConfig == null ? void 0 : generatorConfig.config.engineType) === "library" /* Library */) {
    return "library" /* Library */;
  } else if ((generatorConfig == null ? void 0 : generatorConfig.config.engineType) === "binary" /* Binary */) {
    return "binary" /* Binary */;
  } else {
    return DEFAULT_CLIENT_ENGINE_TYPE;
  }
}
__name(getClientEngineType, "getClientEngineType");
function getEngineTypeFromEnvVar() {
  const engineType = process.env.PRISMA_CLIENT_ENGINE_TYPE;
  if (engineType === "library" /* Library */) {
    return "library" /* Library */;
  } else if (engineType === "binary" /* Binary */) {
    return "binary" /* Binary */;
  } else {
    return void 0;
  }
}
__name(getEngineTypeFromEnvVar, "getEngineTypeFromEnvVar");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ClientEngineType,
  DEFAULT_CLIENT_ENGINE_TYPE,
  getClientEngineType
});
