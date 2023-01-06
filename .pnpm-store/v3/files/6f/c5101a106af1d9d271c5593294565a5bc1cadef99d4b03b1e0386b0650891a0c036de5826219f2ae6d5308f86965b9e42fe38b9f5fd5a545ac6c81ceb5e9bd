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
var getSchema_exports = {};
__export(getSchema_exports, {
  getPrismaConfigFromPackageJson: () => getPrismaConfigFromPackageJson,
  getRelativeSchemaPath: () => getRelativeSchemaPath,
  getSchema: () => getSchema,
  getSchemaDir: () => getSchemaDir,
  getSchemaDirSync: () => getSchemaDirSync,
  getSchemaPath: () => getSchemaPath,
  getSchemaPathFromPackageJson: () => getSchemaPathFromPackageJson,
  getSchemaPathFromPackageJsonSync: () => getSchemaPathFromPackageJsonSync,
  getSchemaPathInternal: () => getSchemaPathInternal,
  getSchemaPathSync: () => getSchemaPathSync,
  getSchemaPathSyncInternal: () => getSchemaPathSyncInternal,
  getSchemaSync: () => getSchemaSync
});
module.exports = __toCommonJS(getSchema_exports);
var import_chalk = __toESM(require("chalk"));
var import_execa = __toESM(require("execa"));
var import_fs = __toESM(require("fs"));
var import_path = __toESM(require("path"));
var import_read_pkg_up = __toESM(require("read-pkg-up"));
var import_util = require("util");
const exists = (0, import_util.promisify)(import_fs.default.exists);
const readFile = (0, import_util.promisify)(import_fs.default.readFile);
async function getSchemaPath(schemaPathFromArgs, opts = {
  cwd: process.cwd()
}) {
  return getSchemaPathInternal(schemaPathFromArgs, {
    cwd: opts.cwd
  });
}
__name(getSchemaPath, "getSchemaPath");
async function getSchemaPathInternal(schemaPathFromArgs, opts = {
  cwd: process.cwd()
}) {
  var _a, _b;
  if (schemaPathFromArgs) {
    const customSchemaPath = await getAbsoluteSchemaPath(import_path.default.resolve(schemaPathFromArgs));
    if (!customSchemaPath) {
      throw new Error(`Provided --schema at ${schemaPathFromArgs} doesn't exist.`);
    }
    return customSchemaPath;
  }
  const schemaPath = (_b = (_a = await getSchemaPathFromPackageJson(opts.cwd)) != null ? _a : await getRelativeSchemaPath(opts.cwd)) != null ? _b : await resolveYarnSchema(opts.cwd);
  if (schemaPath) {
    return schemaPath;
  }
  return null;
}
__name(getSchemaPathInternal, "getSchemaPathInternal");
async function getPrismaConfigFromPackageJson(cwd) {
  var _a;
  const pkgJson = await (0, import_read_pkg_up.default)({ cwd });
  const prismaPropertyFromPkgJson = (_a = pkgJson == null ? void 0 : pkgJson.packageJson) == null ? void 0 : _a.prisma;
  if (!pkgJson) {
    return null;
  }
  return {
    data: prismaPropertyFromPkgJson,
    packagePath: pkgJson.path
  };
}
__name(getPrismaConfigFromPackageJson, "getPrismaConfigFromPackageJson");
async function getSchemaPathFromPackageJson(cwd) {
  var _a;
  const prismaConfig = await getPrismaConfigFromPackageJson(cwd);
  if (!prismaConfig || !((_a = prismaConfig.data) == null ? void 0 : _a.schema)) {
    return null;
  }
  const schemaPathFromPkgJson = prismaConfig.data.schema;
  if (typeof schemaPathFromPkgJson !== "string") {
    throw new Error(`Provided schema path \`${schemaPathFromPkgJson}\` from \`${import_path.default.relative(cwd, prismaConfig.packagePath)}\` must be of type string`);
  }
  const absoluteSchemaPath = import_path.default.isAbsolute(schemaPathFromPkgJson) ? schemaPathFromPkgJson : import_path.default.resolve(import_path.default.dirname(prismaConfig.packagePath), schemaPathFromPkgJson);
  if (await exists(absoluteSchemaPath) === false) {
    throw new Error(`Provided schema path \`${import_path.default.relative(cwd, absoluteSchemaPath)}\` from \`${import_path.default.relative(cwd, prismaConfig.packagePath)}\` doesn't exist.`);
  }
  return absoluteSchemaPath;
}
__name(getSchemaPathFromPackageJson, "getSchemaPathFromPackageJson");
async function resolveYarnSchema(cwd) {
  var _a, _b, _c;
  if ((_a = process.env.npm_config_user_agent) == null ? void 0 : _a.includes("yarn")) {
    try {
      const { stdout: version } = await import_execa.default.command("yarn --version", {
        cwd
      });
      if (version.startsWith("2")) {
        return null;
      }
      const { stdout } = await import_execa.default.command("yarn workspaces info --json", {
        cwd
      });
      const json = getJson(stdout);
      const workspaces = Object.values(json);
      const workspaceRootDir = await findWorkspaceRoot(cwd);
      if (!workspaceRootDir) {
        return null;
      }
      for (const workspace of workspaces) {
        const workspacePath = import_path.default.join(workspaceRootDir, workspace.location);
        const workspaceSchemaPath = (_b = getSchemaPathFromPackageJsonSync(workspacePath)) != null ? _b : getRelativeSchemaPathSync(workspacePath);
        if (workspaceSchemaPath) {
          return workspaceSchemaPath;
        }
      }
      const workspaceSchemaPathFromRoot = (_c = getSchemaPathFromPackageJsonSync(workspaceRootDir)) != null ? _c : getRelativeSchemaPathSync(workspaceRootDir);
      if (workspaceSchemaPathFromRoot) {
        return workspaceSchemaPathFromRoot;
      }
    } catch (e) {
      return null;
    }
  }
  return null;
}
__name(resolveYarnSchema, "resolveYarnSchema");
function resolveYarnSchemaSync(cwd) {
  var _a, _b, _c;
  if ((_a = process.env.npm_config_user_agent) == null ? void 0 : _a.includes("yarn")) {
    try {
      const { stdout: version } = import_execa.default.commandSync("yarn --version", {
        cwd
      });
      if (version.startsWith("2")) {
        return null;
      }
      const { stdout } = import_execa.default.commandSync("yarn workspaces info --json", {
        cwd
      });
      const json = getJson(stdout);
      const workspaces = Object.values(json);
      const workspaceRootDir = findWorkspaceRootSync(cwd);
      if (!workspaceRootDir) {
        return null;
      }
      for (const workspace of workspaces) {
        const workspacePath = import_path.default.join(workspaceRootDir, workspace.location);
        const workspaceSchemaPath = (_b = getSchemaPathFromPackageJsonSync(workspacePath)) != null ? _b : getRelativeSchemaPathSync(workspacePath);
        if (workspaceSchemaPath) {
          return workspaceSchemaPath;
        }
      }
      const workspaceSchemaPathFromRoot = (_c = getSchemaPathFromPackageJsonSync(workspaceRootDir)) != null ? _c : getRelativeSchemaPathSync(workspaceRootDir);
      if (workspaceSchemaPathFromRoot) {
        return workspaceSchemaPathFromRoot;
      }
    } catch (e) {
      return null;
    }
  }
  return null;
}
__name(resolveYarnSchemaSync, "resolveYarnSchemaSync");
async function getAbsoluteSchemaPath(schemaPath) {
  if (await exists(schemaPath)) {
    return schemaPath;
  }
  return null;
}
__name(getAbsoluteSchemaPath, "getAbsoluteSchemaPath");
async function getRelativeSchemaPath(cwd) {
  let schemaPath;
  schemaPath = import_path.default.join(cwd, "schema.prisma");
  if (await exists(schemaPath)) {
    return schemaPath;
  }
  schemaPath = import_path.default.join(cwd, `prisma/schema.prisma`);
  if (await exists(schemaPath)) {
    return schemaPath;
  }
  return null;
}
__name(getRelativeSchemaPath, "getRelativeSchemaPath");
async function getSchemaDir(schemaPathFromArgs) {
  if (schemaPathFromArgs) {
    return import_path.default.resolve(import_path.default.dirname(schemaPathFromArgs));
  }
  const schemaPath = await getSchemaPath(schemaPathFromArgs);
  if (!schemaPath) {
    return null;
  }
  return import_path.default.dirname(schemaPath);
}
__name(getSchemaDir, "getSchemaDir");
async function getSchema(schemaPathFromArgs) {
  const schemaPath = await getSchemaPath(schemaPathFromArgs);
  if (!schemaPath) {
    throw new Error(`Could not find a ${import_chalk.default.bold("schema.prisma")} file that is required for this command.
You can either provide it with ${import_chalk.default.greenBright("--schema")}, set it as \`prisma.schema\` in your package.json or put it into the default location ${import_chalk.default.greenBright("./prisma/schema.prisma")} https://pris.ly/d/prisma-schema-location`);
  }
  return readFile(schemaPath, "utf-8");
}
__name(getSchema, "getSchema");
function getSchemaPathSync(schemaPathFromArgs) {
  return getSchemaPathSyncInternal(schemaPathFromArgs, {
    cwd: process.cwd()
  });
}
__name(getSchemaPathSync, "getSchemaPathSync");
function getSchemaPathSyncInternal(schemaPathFromArgs, opts = {
  cwd: process.cwd()
}) {
  var _a, _b;
  if (schemaPathFromArgs) {
    const customSchemaPath = getAbsoluteSchemaPathSync(import_path.default.resolve(schemaPathFromArgs));
    if (!customSchemaPath) {
      throw new Error(`Provided --schema at ${schemaPathFromArgs} doesn't exist.`);
    }
    return customSchemaPath;
  }
  const schemaPath = (_b = (_a = getSchemaPathFromPackageJsonSync(opts.cwd)) != null ? _a : getRelativeSchemaPathSync(opts.cwd)) != null ? _b : resolveYarnSchemaSync(opts.cwd);
  if (schemaPath) {
    return schemaPath;
  }
  return null;
}
__name(getSchemaPathSyncInternal, "getSchemaPathSyncInternal");
function getSchemaPathFromPackageJsonSync(cwd) {
  var _a, _b;
  const pkgJson = import_read_pkg_up.default.sync({ cwd });
  const schemaPathFromPkgJson = (_b = (_a = pkgJson == null ? void 0 : pkgJson.packageJson) == null ? void 0 : _a.prisma) == null ? void 0 : _b.schema;
  if (!schemaPathFromPkgJson || !pkgJson) {
    return null;
  }
  if (typeof schemaPathFromPkgJson !== "string") {
    throw new Error(`Provided schema path \`${schemaPathFromPkgJson}\` from \`${import_path.default.relative(cwd, pkgJson.path)}\` must be of type string`);
  }
  const absoluteSchemaPath = import_path.default.isAbsolute(schemaPathFromPkgJson) ? schemaPathFromPkgJson : import_path.default.resolve(import_path.default.dirname(pkgJson.path), schemaPathFromPkgJson);
  if (import_fs.default.existsSync(absoluteSchemaPath) === false) {
    throw new Error(`Provided schema path \`${import_path.default.relative(cwd, absoluteSchemaPath)}\` from \`${import_path.default.relative(cwd, pkgJson.path)}\` doesn't exist.`);
  }
  return absoluteSchemaPath;
}
__name(getSchemaPathFromPackageJsonSync, "getSchemaPathFromPackageJsonSync");
function getAbsoluteSchemaPathSync(schemaPath) {
  if (import_fs.default.existsSync(schemaPath)) {
    return schemaPath;
  }
  return null;
}
__name(getAbsoluteSchemaPathSync, "getAbsoluteSchemaPathSync");
function getRelativeSchemaPathSync(cwd) {
  let schemaPath = import_path.default.join(cwd, "schema.prisma");
  if (import_fs.default.existsSync(schemaPath)) {
    return schemaPath;
  }
  schemaPath = import_path.default.join(cwd, `prisma/schema.prisma`);
  if (import_fs.default.existsSync(schemaPath)) {
    return schemaPath;
  }
  return null;
}
__name(getRelativeSchemaPathSync, "getRelativeSchemaPathSync");
function getSchemaDirSync(schemaPathFromArgs) {
  if (schemaPathFromArgs) {
    return import_path.default.resolve(import_path.default.dirname(schemaPathFromArgs));
  }
  const schemaPath = getSchemaPathSync(schemaPathFromArgs);
  if (schemaPath) {
    return import_path.default.dirname(schemaPath);
  }
  return null;
}
__name(getSchemaDirSync, "getSchemaDirSync");
function getSchemaSync(schemaPathFromArgs) {
  const schemaPath = getSchemaPathSync(schemaPathFromArgs);
  if (!schemaPath) {
    throw new Error(`Could not find a ${import_chalk.default.bold("schema.prisma")} file that is required for this command.
You can either provide it with ${import_chalk.default.greenBright("--schema")}, set it as \`prisma.schema\` in your package.json or put it into the default location ${import_chalk.default.greenBright("./prisma/schema.prisma")} https://pris.ly/d/prisma-schema-location`);
  }
  return import_fs.default.readFileSync(schemaPath, "utf-8");
}
__name(getSchemaSync, "getSchemaSync");
function getJson(stdout) {
  const firstCurly = stdout.indexOf("{");
  const lastCurly = stdout.lastIndexOf("}");
  const sliced = stdout.slice(firstCurly, lastCurly + 1);
  return JSON.parse(sliced);
}
__name(getJson, "getJson");
function isPkgJsonWorkspaceRoot(pkgJson) {
  const workspaces = pkgJson.workspaces;
  if (!workspaces) {
    return false;
  }
  return Array.isArray(workspaces) || workspaces.packages !== void 0;
}
__name(isPkgJsonWorkspaceRoot, "isPkgJsonWorkspaceRoot");
async function isNearestPkgJsonWorkspaceRoot(cwd) {
  const pkgJson = await (0, import_read_pkg_up.default)({ cwd });
  if (!pkgJson) {
    return null;
  }
  return {
    isRoot: isPkgJsonWorkspaceRoot(pkgJson.packageJson),
    path: pkgJson.path
  };
}
__name(isNearestPkgJsonWorkspaceRoot, "isNearestPkgJsonWorkspaceRoot");
function isNearestPkgJsonWorkspaceRootSync(cwd) {
  const pkgJson = import_read_pkg_up.default.sync({ cwd });
  if (!pkgJson) {
    return null;
  }
  return {
    isRoot: isPkgJsonWorkspaceRoot(pkgJson.packageJson),
    path: pkgJson.path
  };
}
__name(isNearestPkgJsonWorkspaceRootSync, "isNearestPkgJsonWorkspaceRootSync");
async function findWorkspaceRoot(cwd) {
  let pkgJson = await isNearestPkgJsonWorkspaceRoot(cwd);
  if (!pkgJson) {
    return null;
  }
  if (pkgJson.isRoot === true) {
    return import_path.default.dirname(pkgJson.path);
  }
  const pkgJsonParentDir = import_path.default.dirname(import_path.default.dirname(pkgJson.path));
  pkgJson = await isNearestPkgJsonWorkspaceRoot(pkgJsonParentDir);
  if (!pkgJson || pkgJson.isRoot === false) {
    return null;
  }
  return import_path.default.dirname(pkgJson.path);
}
__name(findWorkspaceRoot, "findWorkspaceRoot");
function findWorkspaceRootSync(cwd) {
  let pkgJson = isNearestPkgJsonWorkspaceRootSync(cwd);
  if (!pkgJson) {
    return null;
  }
  if (pkgJson.isRoot === true) {
    return import_path.default.dirname(pkgJson.path);
  }
  const pkgJsonParentDir = import_path.default.dirname(import_path.default.dirname(pkgJson.path));
  pkgJson = isNearestPkgJsonWorkspaceRootSync(pkgJsonParentDir);
  if (!pkgJson || pkgJson.isRoot === false) {
    return null;
  }
  return import_path.default.dirname(pkgJson.path);
}
__name(findWorkspaceRootSync, "findWorkspaceRootSync");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getPrismaConfigFromPackageJson,
  getRelativeSchemaPath,
  getSchema,
  getSchemaDir,
  getSchemaDirSync,
  getSchemaPath,
  getSchemaPathFromPackageJson,
  getSchemaPathFromPackageJsonSync,
  getSchemaPathInternal,
  getSchemaPathSync,
  getSchemaPathSyncInternal,
  getSchemaSync
});
