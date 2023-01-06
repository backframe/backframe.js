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
  resolveOutput: () => resolveOutput
});
var import_fs = __toModule(require("fs"));
var import_path = __toModule(require("path"));
var import_util = __toModule(require("util"));
const exists = (0, import_util.promisify)(import_fs.default.exists);
async function resolveNodeModulesBase(cwd) {
  if (await exists(import_path.default.resolve(process.cwd(), "prisma/schema.prisma"))) {
    return process.cwd();
  }
  if (import_path.default.relative(process.cwd(), cwd) === "prisma" && await exists(import_path.default.resolve(process.cwd(), "package.json"))) {
    return process.cwd();
  }
  if (await exists(import_path.default.resolve(cwd, "node_modules"))) {
    return cwd;
  }
  if (await exists(import_path.default.resolve(cwd, "../node_modules"))) {
    return import_path.default.join(cwd, "../");
  }
  if (await exists(import_path.default.resolve(cwd, "package.json"))) {
    return cwd;
  }
  if (await exists(import_path.default.resolve(cwd, "../package.json"))) {
    return import_path.default.join(cwd, "../");
  }
  return cwd;
}
async function resolveOutput(options) {
  const defaultOutput = stripRelativePath(options.defaultOutput);
  if (defaultOutput.startsWith("node_modules")) {
    const nodeModulesBase = await resolveNodeModulesBase(options.baseDir);
    return import_path.default.resolve(nodeModulesBase, defaultOutput);
  }
  return import_path.default.resolve(options.baseDir, defaultOutput);
}
function stripRelativePath(pathString) {
  if (pathString.startsWith("./")) {
    return pathString.slice(2);
  }
  return pathString;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  resolveOutput
});
