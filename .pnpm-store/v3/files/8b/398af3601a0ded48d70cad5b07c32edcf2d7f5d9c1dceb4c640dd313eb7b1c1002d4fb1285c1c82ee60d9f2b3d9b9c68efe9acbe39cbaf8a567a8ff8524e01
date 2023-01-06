var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};
__export(exports, {
  formatSchema: () => formatSchema
});
var import_debug = __toModule(require("@prisma/debug"));
var import_fetch_engine = __toModule(require("@prisma/fetch-engine"));
var import_execa = __toModule(require("execa"));
var import_fs = __toModule(require("fs"));
var import_resolveBinary = __toModule(require("../resolveBinary"));
const debug = (0, import_debug.default)("prisma:formatSchema");
const MAX_BUFFER = 1e9;
async function formatSchema({
  schemaPath,
  schema
}) {
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  formatSchema
});
