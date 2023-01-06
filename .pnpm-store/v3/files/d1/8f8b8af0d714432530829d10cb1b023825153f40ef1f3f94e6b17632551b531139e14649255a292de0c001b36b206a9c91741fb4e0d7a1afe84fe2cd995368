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
var formatSchema_exports = {};
__export(formatSchema_exports, {
  formatSchema: () => formatSchema
});
module.exports = __toCommonJS(formatSchema_exports);
var import_debug = __toESM(require("@prisma/debug"));
var import_fetch_engine = require("@prisma/fetch-engine");
var import_execa = __toESM(require("execa"));
var import_fs = __toESM(require("fs"));
var import_resolveBinary = require("../resolveBinary");
const debug = (0, import_debug.default)("prisma:formatSchema");
const MAX_BUFFER = 1e9;
async function formatSchema({ schemaPath, schema }) {
  if (!schema && !schemaPath) {
    throw new Error(`Parameter schema or schemaPath must be passed.`);
  }
  const prismaFmtPath = await (0, import_resolveBinary.resolveBinary)(import_fetch_engine.BinaryType.prismaFmt);
  const showColors = !process.env.NO_COLOR && process.stdout.isTTY;
  const options = {
    env: {
      RUST_BACKTRACE: "1",
      ...showColors ? { CLICOLOR_FORCE: "1" } : {}
    },
    maxBuffer: MAX_BUFFER
  };
  let result;
  if (process.env.FORCE_PANIC_PRISMA_FMT) {
    result = await (0, import_execa.default)(prismaFmtPath, ["debug-panic"], options);
  }
  if (schemaPath) {
    if (!import_fs.default.existsSync(schemaPath)) {
      throw new Error(`Schema at ${schemaPath} does not exist.`);
    }
    result = await (0, import_execa.default)(prismaFmtPath, ["format", "-i", schemaPath], options);
  } else if (schema) {
    result = await (0, import_execa.default)(prismaFmtPath, ["format"], {
      ...options,
      input: schema
    });
  }
  return result.stdout;
}
__name(formatSchema, "formatSchema");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  formatSchema
});
