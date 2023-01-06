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
var isCurrentBinInstalledGlobally_exports = {};
__export(isCurrentBinInstalledGlobally_exports, {
  isCurrentBinInstalledGlobally: () => isCurrentBinInstalledGlobally
});
module.exports = __toCommonJS(isCurrentBinInstalledGlobally_exports);
var import_fs = __toESM(require("fs"));
var import_global_dirs = __toESM(require("global-dirs"));
function isCurrentBinInstalledGlobally() {
  try {
    const realPrismaPath = import_fs.default.realpathSync(process.argv[1]);
    const usingGlobalYarn = realPrismaPath.indexOf(import_global_dirs.default.yarn.packages) === 0;
    const usingGlobalNpm = realPrismaPath.indexOf(import_fs.default.realpathSync(import_global_dirs.default.npm.packages)) === 0;
    if (usingGlobalNpm) {
      return "npm";
    }
    if (usingGlobalYarn) {
      return "yarn";
    } else {
      false;
    }
  } catch (e) {
  }
  return false;
}
__name(isCurrentBinInstalledGlobally, "isCurrentBinInstalledGlobally");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  isCurrentBinInstalledGlobally
});
