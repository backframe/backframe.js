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
var spinner_exports = {};
__export(spinner_exports, {
  createSpinner: () => createSpinner
});
module.exports = __toCommonJS(spinner_exports);
var import_ora = __toESM(require("ora"));
const defaultOraOptions = {
  spinner: "dots",
  color: "cyan",
  indent: 0,
  stream: process.stdout
};
function createSpinner(enableOutput = true, oraOptions = {}) {
  const actualOptions = { ...defaultOraOptions, ...oraOptions };
  return (text) => {
    var _a;
    if (!enableOutput) {
      return {
        success: () => {
        },
        failure: () => {
        }
      };
    }
    (_a = actualOptions.stream) == null ? void 0 : _a.write("\n");
    const spinner = (0, import_ora.default)(actualOptions);
    spinner.start(text);
    return {
      success: (textSuccess) => {
        spinner.succeed(textSuccess);
      },
      failure: (textFailure) => {
        spinner.fail(textFailure);
      }
    };
  };
}
__name(createSpinner, "createSpinner");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createSpinner
});
