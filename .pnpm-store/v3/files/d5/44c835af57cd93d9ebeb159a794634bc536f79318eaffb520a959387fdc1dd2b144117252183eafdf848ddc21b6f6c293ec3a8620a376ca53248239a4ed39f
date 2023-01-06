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
var resolveBinary_exports = {};
__export(resolveBinary_exports, {
  BinaryType: () => import_fetch_engine.BinaryType,
  engineEnvVarMap: () => engineEnvVarMap,
  maybeCopyToTmp: () => maybeCopyToTmp,
  resolveBinary: () => resolveBinary
});
module.exports = __toCommonJS(resolveBinary_exports);
var import_debug = __toESM(require("@prisma/debug"));
var import_engine_core = require("@prisma/engine-core");
var import_engines = require("@prisma/engines");
var import_fetch_engine = require("@prisma/fetch-engine");
var import_get_platform = require("@prisma/get-platform");
var import_fs = __toESM(require("fs"));
var import_make_dir = __toESM(require("make-dir"));
var import_path = __toESM(require("path"));
var import_temp_dir = __toESM(require("temp-dir"));
var import_util = require("util");
const readFile = (0, import_util.promisify)(import_fs.default.readFile);
const writeFile = (0, import_util.promisify)(import_fs.default.writeFile);
const debug = (0, import_debug.default)("prisma:resolveBinary");
async function getBinaryName(name) {
  const platform = await (0, import_get_platform.getPlatform)();
  const extension = platform === "windows" ? ".exe" : "";
  if (name === import_fetch_engine.BinaryType.libqueryEngine) {
    return (0, import_get_platform.getNodeAPIName)(platform, "fs");
  }
  return `${name}-${platform}${extension}`;
}
__name(getBinaryName, "getBinaryName");
const engineEnvVarMap = {
  [import_fetch_engine.BinaryType.queryEngine]: "PRISMA_QUERY_ENGINE_BINARY",
  [import_fetch_engine.BinaryType.libqueryEngine]: "PRISMA_QUERY_ENGINE_LIBRARY",
  [import_fetch_engine.BinaryType.migrationEngine]: "PRISMA_MIGRATION_ENGINE_BINARY",
  [import_fetch_engine.BinaryType.introspectionEngine]: "PRISMA_INTROSPECTION_ENGINE_BINARY",
  [import_fetch_engine.BinaryType.prismaFmt]: "PRISMA_FMT_BINARY"
};
async function resolveBinary(name, proposedPath) {
  if (proposedPath && !proposedPath.startsWith("/snapshot/") && import_fs.default.existsSync(proposedPath)) {
    return proposedPath;
  }
  const envVar = engineEnvVarMap[name];
  if (process.env[envVar]) {
    if (!import_fs.default.existsSync(process.env[envVar])) {
      throw new Error(`Env var ${envVar} is provided, but provided path ${process.env[envVar]} can't be resolved.`);
    }
    return process.env[envVar];
  }
  const binaryName = await getBinaryName(name);
  const prismaPath = import_path.default.join((0, import_engines.getEnginesPath)(), binaryName);
  if (import_fs.default.existsSync(prismaPath)) {
    return maybeCopyToTmp(prismaPath);
  }
  const prismaPath2 = import_path.default.join(__dirname, "..", binaryName);
  if (import_fs.default.existsSync(prismaPath2)) {
    return maybeCopyToTmp(prismaPath2);
  }
  const prismaPath3 = import_path.default.join(__dirname, "../..", binaryName);
  if (import_fs.default.existsSync(prismaPath3)) {
    return maybeCopyToTmp(prismaPath3);
  }
  const prismaPath4 = import_path.default.join(__dirname, "../runtime", binaryName);
  if (import_fs.default.existsSync(prismaPath4)) {
    return maybeCopyToTmp(prismaPath4);
  }
  throw new Error(`Could not find ${name} binary. Searched in:
- ${prismaPath}
- ${prismaPath2}
- ${prismaPath3}
- ${prismaPath4}`);
}
__name(resolveBinary, "resolveBinary");
async function maybeCopyToTmp(file) {
  const dir = eval("__dirname");
  if (dir.startsWith("/snapshot/")) {
    const targetDir = import_path.default.join(import_temp_dir.default, "prisma-binaries");
    await (0, import_make_dir.default)(targetDir);
    const target = import_path.default.join(targetDir, import_path.default.basename(file));
    const data = await readFile(file);
    await writeFile(target, data);
    (0, import_engine_core.plusX)(target);
    return target;
  }
  return file;
}
__name(maybeCopyToTmp, "maybeCopyToTmp");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BinaryType,
  engineEnvVarMap,
  maybeCopyToTmp,
  resolveBinary
});
