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
var theme_exports = {};
__export(theme_exports, {
  blue: () => blue,
  brightBlue: () => brightBlue,
  darkBrightBlue: () => darkBrightBlue,
  gamboge: () => gamboge,
  identity: () => identity,
  theme: () => theme
});
module.exports = __toCommonJS(theme_exports);
var import_chalk = __toESM(require("chalk"));
const gamboge = import_chalk.default.rgb(228, 155, 15);
const darkBrightBlue = import_chalk.default.rgb(107, 139, 140);
const blue = import_chalk.default.cyan;
const brightBlue = import_chalk.default.rgb(127, 155, 175);
const identity = /* @__PURE__ */ __name((str) => str || "", "identity");
const theme = {
  keyword: blue,
  entity: blue,
  value: brightBlue,
  punctuation: darkBrightBlue,
  directive: blue,
  function: blue,
  variable: brightBlue,
  string: brightBlue,
  boolean: gamboge,
  comment: import_chalk.default.dim
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  blue,
  brightBlue,
  darkBrightBlue,
  gamboge,
  identity,
  theme
});
