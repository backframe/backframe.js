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
var printGeneratorConfig_exports = {};
__export(printGeneratorConfig_exports, {
  GeneratorConfigClass: () => GeneratorConfigClass,
  getOriginalBinaryTargetsValue: () => getOriginalBinaryTargetsValue,
  printDatamodelObject: () => printDatamodelObject,
  printGeneratorConfig: () => printGeneratorConfig
});
module.exports = __toCommonJS(printGeneratorConfig_exports);
var import_indent_string = __toESM(require("indent-string"));
function printGeneratorConfig(config) {
  return String(new GeneratorConfigClass(config));
}
__name(printGeneratorConfig, "printGeneratorConfig");
class GeneratorConfigClass {
  constructor(config) {
    this.config = config;
  }
  toString() {
    const { config } = this;
    const provider = config.provider.fromEnvVar ? `env("${config.provider.fromEnvVar}")` : config.provider.value;
    const obj = JSON.parse(JSON.stringify({
      provider,
      binaryTargets: getOriginalBinaryTargetsValue(config.binaryTargets)
    }));
    return `generator ${config.name} {
${(0, import_indent_string.default)(printDatamodelObject(obj), 2)}
}`;
  }
}
__name(GeneratorConfigClass, "GeneratorConfigClass");
function getOriginalBinaryTargetsValue(binaryTargets) {
  let value;
  if (binaryTargets.length > 0) {
    const binaryTargetsFromEnvVar = binaryTargets.find((object) => object.fromEnvVar !== null);
    if (binaryTargetsFromEnvVar) {
      value = `env("${binaryTargetsFromEnvVar.fromEnvVar}")`;
    } else {
      value = binaryTargets.map((object) => object.value);
    }
  } else {
    value = void 0;
  }
  return value;
}
__name(getOriginalBinaryTargetsValue, "getOriginalBinaryTargetsValue");
function printDatamodelObject(obj) {
  const maxLength = Object.keys(obj).reduce((max, curr) => Math.max(max, curr.length), 0);
  return Object.entries(obj).map(([key, value]) => `${key.padEnd(maxLength)} = ${niceStringify(value)}`).join("\n");
}
__name(printDatamodelObject, "printDatamodelObject");
function niceStringify(value) {
  return JSON.parse(JSON.stringify(value, (_, value2) => {
    if (Array.isArray(value2)) {
      return `[${value2.map((element) => JSON.stringify(element)).join(", ")}]`;
    }
    return JSON.stringify(value2);
  }));
}
__name(niceStringify, "niceStringify");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GeneratorConfigClass,
  getOriginalBinaryTargetsValue,
  printDatamodelObject,
  printGeneratorConfig
});
