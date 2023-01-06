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
var checkUnsupportedDataProxy_exports = {};
__export(checkUnsupportedDataProxy_exports, {
  checkUnsupportedDataProxy: () => checkUnsupportedDataProxy,
  forbiddenCmdWithDataProxyFlagMessage: () => forbiddenCmdWithDataProxyFlagMessage
});
module.exports = __toCommonJS(checkUnsupportedDataProxy_exports);
var import_chalk = __toESM(require("chalk"));
var import_fs = __toESM(require("fs"));
var import__ = require("..");
var import_loadEnvFile = require("../utils/loadEnvFile");
const checkedArgs = {
  "--url": true,
  "--to-url": true,
  "--from-url": true,
  "--shadow-database-url": true,
  "--schema": true,
  "--from-schema-datamodel": true,
  "--to-schema-datamodel": true
};
const forbiddenCmdWithDataProxyFlagMessage = /* @__PURE__ */ __name((command) => `
Using the Data Proxy (connection URL starting with protocol ${import_chalk.default.green("prisma://")}) is not supported for this CLI command ${import_chalk.default.green(`prisma ${command}`)} yet. Please use a direct connection to your database for now.

More information about Data Proxy: ${(0, import__.link)("https://pris.ly/d/data-proxy-cli")}
`, "forbiddenCmdWithDataProxyFlagMessage");
async function checkUnsupportedDataProxyMessage(command, args, implicitSchema) {
  var _a, _b, _c, _d;
  if (implicitSchema === true) {
    args["--schema"] = (_a = await (0, import__.getSchemaPath)(args["--schema"])) != null ? _a : void 0;
  }
  const argList = Object.entries(args);
  for (const [argName, argValue] of argList) {
    if (argName.includes("url") && argValue.includes("prisma://")) {
      return forbiddenCmdWithDataProxyFlagMessage(command);
    }
    if (argName.includes("schema")) {
      (0, import_loadEnvFile.loadEnvFile)(argValue, false);
      const datamodel = await import_fs.default.promises.readFile(argValue, "utf-8");
      const config = await (0, import__.getConfig)({ datamodel, ignoreEnvVarErrors: true });
      const urlFromValue = (_b = config.datasources[0]) == null ? void 0 : _b.url.value;
      const urlEnvVarName = (_c = config.datasources[0]) == null ? void 0 : _c.url.fromEnvVar;
      const urlEnvVarValue = urlEnvVarName ? process.env[urlEnvVarName] : void 0;
      if ((_d = urlFromValue != null ? urlFromValue : urlEnvVarValue) == null ? void 0 : _d.startsWith("prisma://")) {
        return forbiddenCmdWithDataProxyFlagMessage(command);
      }
    }
  }
  return void 0;
}
__name(checkUnsupportedDataProxyMessage, "checkUnsupportedDataProxyMessage");
async function checkUnsupportedDataProxy(command, args, implicitSchema) {
  const message = await checkUnsupportedDataProxyMessage(command, args, implicitSchema).catch(() => void 0);
  if (message)
    throw new Error(message);
}
__name(checkUnsupportedDataProxy, "checkUnsupportedDataProxy");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  checkUnsupportedDataProxy,
  forbiddenCmdWithDataProxyFlagMessage
});
