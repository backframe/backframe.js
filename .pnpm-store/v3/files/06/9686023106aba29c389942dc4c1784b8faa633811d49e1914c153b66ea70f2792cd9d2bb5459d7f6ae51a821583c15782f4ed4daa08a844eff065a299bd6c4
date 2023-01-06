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
  getCLIPathHash: () => getCLIPathHash,
  getProjectHash: () => getProjectHash
});
var import_getSchema = __toModule(require("./getSchema"));
var import_utils = __toModule(require("./utils"));
var import_crypto = __toModule(require("crypto"));
async function getProjectHash() {
  const args = (0, import_utils.arg)(process.argv.slice(3), { "--schema": String });
  let projectPath = await (0, import_getSchema.getSchemaPath)(args["--schema"]);
  projectPath = projectPath || process.cwd();
  return import_crypto.default.createHash("sha256").update(projectPath).digest("hex").substring(0, 8);
}
function getCLIPathHash() {
  const cliPath = process.argv[1];
  return import_crypto.default.createHash("sha256").update(cliPath).digest("hex").substring(0, 8);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getCLIPathHash,
  getProjectHash
});
