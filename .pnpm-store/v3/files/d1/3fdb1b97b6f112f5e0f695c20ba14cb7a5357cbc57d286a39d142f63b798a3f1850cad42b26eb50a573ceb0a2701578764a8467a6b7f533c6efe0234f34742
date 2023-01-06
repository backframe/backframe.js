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
  getEnvPaths: () => getEnvPaths
});
var import_debug = __toModule(require("@prisma/debug"));
var import_find_up = __toModule(require("find-up"));
var import_path = __toModule(require("path"));
var import_fs = __toModule(require("fs"));
var import_getSchema = __toModule(require("../cli/getSchema"));
var import_tryLoadEnvs = __toModule(require("./tryLoadEnvs"));
const debug = (0, import_debug.default)("prisma:loadEnv");
function getEnvPaths(schemaPath, opts = { cwd: process.cwd() }) {
  var _a;
  const rootEnvPath = (_a = getProjectRootEnvPath({ cwd: opts.cwd })) != null ? _a : null;
  const schemaEnvPathFromArgs = schemaPathToEnvPath(schemaPath);
  const schemaEnvPathFromPkgJson = schemaPathToEnvPath(readSchemaPathFromPkgJson());
  const schemaEnvPaths = [
    schemaEnvPathFromArgs,
    schemaEnvPathFromPkgJson,
    "./prisma/.env",
    "./.env"
  ];
  const schemaEnvPath = schemaEnvPaths.find(import_tryLoadEnvs.exists);
  return { rootEnvPath, schemaEnvPath };
}
function readSchemaPathFromPkgJson() {
  try {
    return (0, import_getSchema.getSchemaPathFromPackageJsonSync)(process.cwd());
  } catch (e) {
    return null;
  }
}
function getProjectRootEnvPath(opts) {
  const pkgJsonPath = import_find_up.default.sync((dir) => {
    const pkgPath = import_path.default.join(dir, "package.json");
    if (import_find_up.default.exists(pkgPath)) {
      try {
        const pkg = JSON.parse(import_fs.default.readFileSync(pkgPath, "utf8"));
        if (pkg["name"] !== ".prisma/client") {
          debug(`project root found at ${pkgPath}`);
          return pkgPath;
        }
      } catch (e) {
        debug(`skipping package.json at ${pkgPath}`);
      }
    }
    return void 0;
  }, opts);
  if (!pkgJsonPath) {
    return null;
  }
  const candidate = import_path.default.join(import_path.default.dirname(pkgJsonPath), ".env");
  if (!import_fs.default.existsSync(candidate)) {
    return null;
  }
  return candidate;
}
function schemaPathToEnvPath(schemaPath) {
  if (!schemaPath)
    return null;
  return import_path.default.join(import_path.default.dirname(schemaPath), ".env");
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getEnvPaths
});
