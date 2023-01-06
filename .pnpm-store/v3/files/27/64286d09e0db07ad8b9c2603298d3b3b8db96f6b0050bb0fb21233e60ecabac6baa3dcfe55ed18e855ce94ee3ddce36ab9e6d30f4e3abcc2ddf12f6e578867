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
  GeneratorConfigClass: () => GeneratorConfigClass,
  getOriginalBinaryTargetsValue: () => getOriginalBinaryTargetsValue,
  printDatamodelObject: () => printDatamodelObject,
  printGeneratorConfig: () => printGeneratorConfig
});
var import_indent_string = __toModule(require("indent-string"));
function printGeneratorConfig(config) {
  return String(new GeneratorConfigClass(config));
}
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
function printDatamodelObject(obj) {
  const maxLength = Object.keys(obj).reduce((max, curr) => Math.max(max, curr.length), 0);
  return Object.entries(obj).map(([key, value]) => `${key.padEnd(maxLength)} = ${niceStringify(value)}`).join("\n");
}
function niceStringify(value) {
  return JSON.parse(JSON.stringify(value, (_, value2) => {
    if (Array.isArray(value2)) {
      return `[${value2.map((element) => JSON.stringify(element)).join(", ")}]`;
    }
    return JSON.stringify(value2);
  }));
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GeneratorConfigClass,
  getOriginalBinaryTargetsValue,
  printDatamodelObject,
  printGeneratorConfig
});
