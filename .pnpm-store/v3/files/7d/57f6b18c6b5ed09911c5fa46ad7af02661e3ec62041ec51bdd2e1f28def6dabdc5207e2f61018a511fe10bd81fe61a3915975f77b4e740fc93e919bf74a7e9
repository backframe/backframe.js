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
var getEnvPaths_exports = {};
__export(getEnvPaths_exports, {
  getEnvPaths: () => getEnvPaths
});
module.exports = __toCommonJS(getEnvPaths_exports);
var import_debug = __toESM(require("@prisma/debug"));
var import_find_up = __toESM(require("find-up"));
var import_fs = __toESM(require("fs"));
var import_path = __toESM(require("path"));
var import_getSchema = require("../cli/getSchema");
var import_tryLoadEnvs = require("./tryLoadEnvs");
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
__name(getEnvPaths, "getEnvPaths");
function readSchemaPathFromPkgJson() {
  try {
    return (0, import_getSchema.getSchemaPathFromPackageJsonSync)(process.cwd());
  } catch (e) {
    return null;
  }
}
__name(readSchemaPathFromPkgJson, "readSchemaPathFromPkgJson");
function getProjectRootEnvPath(opts) {
  const pkgJsonPath = import_find_up.default.sync((dir) => {
    const pkgPath = import_path.default.join(dir, "package.json");
    if (import_find_up.default.sync.exists(pkgPath)) {
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
__name(getProjectRootEnvPath, "getProjectRootEnvPath");
function schemaPathToEnvPath(schemaPath) {
  if (!schemaPath)
    return null;
  return import_path.default.join(import_path.default.dirname(schemaPath), ".env");
}
__name(schemaPathToEnvPath, "schemaPathToEnvPath");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getEnvPaths
});
