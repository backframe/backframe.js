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
  parseBinaryTargetsEnvValue: () => parseBinaryTargetsEnvValue,
  parseEnvValue: () => parseEnvValue
});
var import_chalk = __toModule(require("chalk"));
function parseEnvValue(object) {
  if (object.fromEnvVar && object.fromEnvVar != "null") {
    const value = process.env[object.fromEnvVar];
    if (!value) {
      throw new Error(`Attempted to load provider value using \`env(${object.fromEnvVar})\` but it was not present. Please ensure that ${import_chalk.default.dim(object.fromEnvVar)} is present in your Environment Variables`);
    }
    return value;
  }
  return object.value;
}
function parseBinaryTargetsEnvValue(object) {
  if (object.fromEnvVar && object.fromEnvVar != "null") {
    const value = process.env[object.fromEnvVar];
    if (!value) {
      throw new Error(`Attempted to load binaryTargets value using \`env(${object.fromEnvVar})\` but it was not present. Please ensure that ${import_chalk.default.dim(object.fromEnvVar)} is present in your Environment Variables`);
    }
    return JSON.parse(value);
  }
  return object.value;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  parseBinaryTargetsEnvValue,
  parseEnvValue
});
