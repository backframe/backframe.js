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
  exists: () => exists,
  loadEnv: () => loadEnv,
  pathsEqual: () => pathsEqual,
  tryLoadEnvs: () => tryLoadEnvs
});
var import_chalk = __toModule(require("chalk"));
var import_debug = __toModule(require("@prisma/debug"));
var import_dotenv = __toModule(require("dotenv"));
var import_fs = __toModule(require("fs"));
var import_path = __toModule(require("path"));
var import_dotenvExpand = __toModule(require("../dotenvExpand"));
const debug = (0, import_debug.default)("prisma:tryLoadEnv");
function tryLoadEnvs({
  rootEnvPath,
  schemaEnvPath
}, opts = {
  conflictCheck: "none"
}) {
  var _a, _b;
  const rootEnvInfo = loadEnv(rootEnvPath);
  if (opts.conflictCheck !== "none") {
    checkForConflicts(rootEnvInfo, schemaEnvPath, opts.conflictCheck);
  }
  let schemaEnvInfo = null;
  if (!pathsEqual(rootEnvInfo == null ? void 0 : rootEnvInfo.path, schemaEnvPath)) {
    schemaEnvInfo = loadEnv(schemaEnvPath);
  }
  if (!rootEnvInfo && !schemaEnvInfo) {
    debug("No Environment variables loaded");
  }
  if (schemaEnvInfo == null ? void 0 : schemaEnvInfo.dotenvResult.error) {
    return console.error(import_chalk.default.redBright.bold("Schema Env Error: ") + schemaEnvInfo.dotenvResult.error);
  }
  const messages = [rootEnvInfo == null ? void 0 : rootEnvInfo.message, schemaEnvInfo == null ? void 0 : schemaEnvInfo.message].filter(Boolean);
  return {
    message: messages.join("\n"),
    parsed: {
      ...(_a = rootEnvInfo == null ? void 0 : rootEnvInfo.dotenvResult) == null ? void 0 : _a.parsed,
      ...(_b = schemaEnvInfo == null ? void 0 : schemaEnvInfo.dotenvResult) == null ? void 0 : _b.parsed
    }
  };
}
function checkForConflicts(rootEnvInfo, envPath, type) {
  const parsedRootEnv = rootEnvInfo == null ? void 0 : rootEnvInfo.dotenvResult.parsed;
  const areNotTheSame = !pathsEqual(rootEnvInfo == null ? void 0 : rootEnvInfo.path, envPath);
  if (parsedRootEnv && envPath && areNotTheSame && import_fs.default.existsSync(envPath)) {
    const envConfig = import_dotenv.default.parse(import_fs.default.readFileSync(envPath));
    const conflicts = [];
    for (const k in envConfig) {
      if (parsedRootEnv[k] === envConfig[k]) {
        conflicts.push(k);
      }
    }
    if (conflicts.length > 0) {
      const relativeRootEnvPath = import_path.default.relative(process.cwd(), rootEnvInfo.path);
      const relativeEnvPath = import_path.default.relative(process.cwd(), envPath);
      if (type === "error") {
        const message = `There is a conflict between env var${conflicts.length > 1 ? "s" : ""} in ${import_chalk.default.underline(relativeRootEnvPath)} and ${import_chalk.default.underline(relativeEnvPath)}
Conflicting env vars:
${conflicts.map((conflict) => `  ${import_chalk.default.bold(conflict)}`).join("\n")}

We suggest to move the contents of ${import_chalk.default.underline(relativeEnvPath)} to ${import_chalk.default.underline(relativeRootEnvPath)} to consolidate your env vars.
`;
        throw new Error(message);
      } else if (type === "warn") {
        const message = `Conflict for env var${conflicts.length > 1 ? "s" : ""} ${conflicts.map((c) => import_chalk.default.bold(c)).join(", ")} in ${import_chalk.default.underline(relativeRootEnvPath)} and ${import_chalk.default.underline(relativeEnvPath)}
Env vars from ${import_chalk.default.underline(relativeEnvPath)} overwrite the ones from ${import_chalk.default.underline(relativeRootEnvPath)}
      `;
        console.warn(`${import_chalk.default.yellow("warn(prisma)")} ${message}`);
      }
    }
  }
}
function loadEnv(envPath) {
  if (exists(envPath)) {
    debug(`Environment variables loaded from ${envPath}`);
    const debugEnv = process.env.DEBUG;
    let enableDebug = void 0;
    if (debugEnv && (debugEnv.startsWith("prisma") || debugEnv === "*")) {
      enableDebug = true;
    }
    return {
      dotenvResult: (0, import_dotenvExpand.dotenvExpand)(import_dotenv.default.config({
        path: envPath,
        debug: enableDebug
      })),
      message: import_chalk.default.dim(`Environment variables loaded from ${import_path.default.relative(process.cwd(), envPath)}`),
      path: envPath
    };
  } else {
    debug(`Environment variables not found at ${envPath}`);
  }
  return null;
}
function pathsEqual(path1, path2) {
  return path1 && path2 && import_path.default.resolve(path1) === import_path.default.resolve(path2);
}
function exists(p) {
  return Boolean(p && import_fs.default.existsSync(p));
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  exists,
  loadEnv,
  pathsEqual,
  tryLoadEnvs
});
