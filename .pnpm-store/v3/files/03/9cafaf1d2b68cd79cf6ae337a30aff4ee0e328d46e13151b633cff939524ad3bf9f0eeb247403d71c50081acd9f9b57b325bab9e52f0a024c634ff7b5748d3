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
var hasYarn_exports = {};
__export(hasYarn_exports, {
  hasYarn: () => hasYarn
});
module.exports = __toCommonJS(hasYarn_exports);
var import_execa = __toESM(require("execa"));
async function hasYarn(packageDir) {
  try {
    await import_execa.default.command("yarn --version", {
      shell: true,
      cwd: packageDir
    });
    return true;
  } catch (e) {
    return false;
  }
}
__name(hasYarn, "hasYarn");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  hasYarn
});
