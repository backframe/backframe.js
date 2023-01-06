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
var utils_exports = {};
__export(utils_exports, {
  arg: () => arg,
  format: () => format,
  isError: () => isError
});
module.exports = __toCommonJS(utils_exports);
var import_arg = __toESM(require("arg"));
var import_strip_indent = __toESM(require("strip-indent"));
function format(input = "") {
  return (0, import_strip_indent.default)(input).trimRight() + "\n";
}
__name(format, "format");
function arg(argv, spec, stopAtPositional = true, permissive = false) {
  try {
    return (0, import_arg.default)(spec, { argv, stopAtPositional, permissive });
  } catch (e) {
    return e;
  }
}
__name(arg, "arg");
function isError(result) {
  return result instanceof Error;
}
__name(isError, "isError");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  arg,
  format,
  isError
});
