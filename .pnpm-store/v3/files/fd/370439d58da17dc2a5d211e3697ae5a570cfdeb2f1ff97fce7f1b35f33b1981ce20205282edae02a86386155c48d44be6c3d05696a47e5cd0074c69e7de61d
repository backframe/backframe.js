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
var getGeneratorSuccessMessage_exports = {};
__export(getGeneratorSuccessMessage_exports, {
  getGeneratorSuccessMessage: () => getGeneratorSuccessMessage
});
module.exports = __toCommonJS(getGeneratorSuccessMessage_exports);
var import_chalk = __toESM(require("chalk"));
var import_path = __toESM(require("path"));
var import_getClientEngineType = require("../client/getClientEngineType");
var import_formatms = require("../utils/formatms");
var import_parseEnvValue = require("../utils/parseEnvValue");
function getGeneratorSuccessMessage(generator, time) {
  const name = generator.getPrettyName();
  const version = formatVersion(generator);
  const to = formatOutput(generator);
  return `\u2714 Generated ${import_chalk.default.bold(name)}${version ? ` (${version})` : ""}${to} in ${(0, import_formatms.formatms)(time)}`;
}
__name(getGeneratorSuccessMessage, "getGeneratorSuccessMessage");
function formatVersion(generator) {
  var _a, _b;
  const version = (_a = generator.manifest) == null ? void 0 : _a.version;
  if (generator.getProvider() === "prisma-client-js") {
    const engineType = (0, import_getClientEngineType.getClientEngineType)(generator.config);
    const engineMode = ((_b = generator.options) == null ? void 0 : _b.dataProxy) ? "dataproxy" : engineType;
    return version ? `${version} | ${engineMode}` : engineMode;
  }
  return version;
}
__name(formatVersion, "formatVersion");
function formatOutput(generator) {
  var _a;
  const output = (_a = generator.options) == null ? void 0 : _a.generator.output;
  return output ? import_chalk.default.dim(` to .${import_path.default.sep}${import_path.default.relative(process.cwd(), (0, import_parseEnvValue.parseEnvValue)(output))}`) : "";
}
__name(formatOutput, "formatOutput");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getGeneratorSuccessMessage
});
