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
var import_chalk = __toModule(require("chalk"));
var import_execa = __toModule(require("execa"));
var import_fs = __toModule(require("fs"));
var import_path = __toModule(require("path"));
var import_read_pkg_up = __toModule(require("read-pkg-up"));
var import_util = __toModule(require("util"));
const exists = (0, import_util.promisify)(import_fs.default.exists);
const readFile = (0, import_util.promisify)(import_fs.default.readFile);
async function getSchemaPath(schemaPathFromArgs, opts = {
  cwd: process.cwd()
}) {
  return getSchemaPathInternal(schemaPathFromArgs, {
    cwd: opts.cwd
  });
}
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
async function getSchemaPathFromPackageJson(cwd) {
  var _a, _b;
  const pkgJson = await (0, import_read_pkg_up.default)({ cwd });
  const schemaPathFromPkgJson = (_b = (_a = pkgJson == null ? void 0 : pkgJson.packageJson) == null ? void 0 : _a.prisma) == null ? void 0 : _b.schema;
  if (!schemaPathFromPkgJson || !pkgJson) {
    return null;
  }
  if (typeof schemaPathFromPkgJson !== "string") {
    throw new Error(`Provided schema path \`${schemaPathFromPkgJson}\` from \`${import_path.default.relative(cwd, pkgJson.path)}\` must be of type string`);
  }
  const absoluteSchemaPath = import_path.default.isAbsolute(schemaPathFromPkgJson) ? schemaPathFromPkgJson : import_path.default.resolve(import_path.default.dirname(pkgJson.path), schemaPathFromPkgJson);
  if (await exists(absoluteSchemaPath) === false) {
    throw new Error(`Provided schema path \`${import_path.default.relative(cwd, absoluteSchemaPath)}\` from \`${import_path.default.relative(cwd, pkgJson.path)}\` doesn't exist.`);
  }
  return absoluteSchemaPath;
}
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
async function getAbsoluteSchemaPath(schemaPath) {
  if (await exists(schemaPath)) {
    return schemaPath;
  }
  return null;
}
async function getRelativeSchemaPath(cwd) {
  let schemaPath = import_path.default.join(cwd, "schema.prisma");
  if (await exists(schemaPath)) {
    return schemaPath;
  }
  schemaPath = import_path.default.join(cwd, `prisma/schema.prisma`);
  if (await exists(schemaPath)) {
    return schemaPath;
  }
  return null;
}
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
async function getSchema(schemaPathFromArgs) {
  const schemaPath = await getSchemaPath(schemaPathFromArgs);
  if (!schemaPath) {
    throw new Error(`Could not find a ${import_chalk.default.bold("schema.prisma")} file that is required for this command.
You can either provide it with ${import_chalk.default.greenBright("--schema")}, set it as \`prisma.schema\` in your package.json or put it into the default location ${import_chalk.default.greenBright("./prisma/schema.prisma")} https://pris.ly/d/prisma-schema-location`);
  }
  return readFile(schemaPath, "utf-8");
}
function getSchemaPathSync(schemaPathFromArgs) {
  return getSchemaPathSyncInternal(schemaPathFromArgs, {
    cwd: process.cwd()
  });
}
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
function getAbsoluteSchemaPathSync(schemaPath) {
  if (import_fs.default.existsSync(schemaPath)) {
    return schemaPath;
  }
  return null;
}
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
function getSchemaSync(schemaPathFromArgs) {
  const schemaPath = getSchemaPathSync(schemaPathFromArgs);
  if (!schemaPath) {
    throw new Error(`Could not find a ${import_chalk.default.bold("schema.prisma")} file that is required for this command.
You can either provide it with ${import_chalk.default.greenBright("--schema")}, set it as \`prisma.schema\` in your package.json or put it into the default location ${import_chalk.default.greenBright("./prisma/schema.prisma")} https://pris.ly/d/prisma-schema-location`);
  }
  return import_fs.default.readFileSync(schemaPath, "utf-8");
}
function getJson(stdout) {
  const firstCurly = stdout.indexOf("{");
  const lastCurly = stdout.lastIndexOf("}");
  const sliced = stdout.slice(firstCurly, lastCurly + 1);
  return JSON.parse(sliced);
}
function isPkgJsonWorkspaceRoot(pkgJson) {
  const workspaces = pkgJson.workspaces;
  if (!workspaces) {
    return false;
  }
  return Array.isArray(workspaces) || workspaces.packages !== void 0;
}
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
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
