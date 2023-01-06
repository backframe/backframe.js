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
var parseEnvValue_exports = {};
__export(parseEnvValue_exports, {
  parseBinaryTargetsEnvValue: () => parseBinaryTargetsEnvValue,
  parseEnvValue: () => parseEnvValue
});
module.exports = __toCommonJS(parseEnvValue_exports);
var import_chalk = __toESM(require("chalk"));
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
__name(parseEnvValue, "parseEnvValue");
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
__name(parseBinaryTargetsEnvValue, "parseBinaryTargetsEnvValue");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  parseBinaryTargetsEnvValue,
  parseEnvValue
});
