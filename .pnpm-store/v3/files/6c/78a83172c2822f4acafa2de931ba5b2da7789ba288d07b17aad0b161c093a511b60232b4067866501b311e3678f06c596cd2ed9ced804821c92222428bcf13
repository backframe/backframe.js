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
var logger_exports = {};
__export(logger_exports, {
  error: () => error,
  info: () => info,
  log: () => log,
  query: () => query,
  should: () => should,
  tags: () => tags,
  warn: () => warn
});
module.exports = __toCommonJS(logger_exports);
var import_chalk = __toESM(require("chalk"));
const tags = {
  error: import_chalk.default.red("prisma:error"),
  warn: import_chalk.default.yellow("prisma:warn"),
  info: import_chalk.default.cyan("prisma:info"),
  query: import_chalk.default.blue("prisma:query")
};
const should = {
  warn: !process.env.PRISMA_DISABLE_WARNINGS
};
function log(...data) {
  console.log(...data);
}
__name(log, "log");
function warn(message, ...optionalParams) {
  if (should.warn) {
    console.warn(`${tags.warn} ${message}`, ...optionalParams);
  }
}
__name(warn, "warn");
function info(message, ...optionalParams) {
  console.info(`${tags.info} ${message}`, ...optionalParams);
}
__name(info, "info");
function error(message, ...optionalParams) {
  console.error(`${tags.error} ${message}`, ...optionalParams);
}
__name(error, "error");
function query(message, ...optionalParams) {
  console.log(`${tags.query} ${message}`, ...optionalParams);
}
__name(query, "query");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  error,
  info,
  log,
  query,
  should,
  tags,
  warn
});
