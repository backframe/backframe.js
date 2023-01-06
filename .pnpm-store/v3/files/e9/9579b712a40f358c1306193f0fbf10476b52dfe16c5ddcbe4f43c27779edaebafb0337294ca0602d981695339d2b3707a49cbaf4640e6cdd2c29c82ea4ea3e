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
var getCommandWithExecutor_exports = {};
__export(getCommandWithExecutor_exports, {
  getCommandWithExecutor: () => getCommandWithExecutor
});
module.exports = __toCommonJS(getCommandWithExecutor_exports);
var import_isCurrentBinInstalledGlobally = require("./isCurrentBinInstalledGlobally");
function getCommandWithExecutor(command) {
  var _a;
  if ((0, import_isCurrentBinInstalledGlobally.isCurrentBinInstalledGlobally)()) {
    return command;
  } else {
    const yarnUsed = (_a = process.env.npm_config_user_agent) == null ? void 0 : _a.includes("yarn");
    const npxUsed = __dirname.includes("_npx");
    if (npxUsed) {
      return `npx ${command}`;
    } else if (yarnUsed) {
      return `yarn ${command}`;
    } else {
      return command;
    }
  }
}
__name(getCommandWithExecutor, "getCommandWithExecutor");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getCommandWithExecutor
});
