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
  getVersion: () => getVersion
});
var import_debug = __toModule(require("@prisma/debug"));
var import_engines = __toModule(require("@prisma/engines"));
var import_fetch_engine = __toModule(require("@prisma/fetch-engine"));
var import_get_platform = __toModule(require("@prisma/get-platform"));
var import_execa = __toModule(require("execa"));
var import_resolveBinary = __toModule(require("../resolveBinary"));
var import_load = __toModule(require("../utils/load"));
const debug = (0, import_debug.default)("prisma:getVersion");
const MAX_BUFFER = 1e9;
async function getVersion(enginePath, binaryName) {
  if (!binaryName) {
    binaryName = (0, import_engines.getCliQueryEngineBinaryType)();
  }
  enginePath = await (0, import_resolveBinary.resolveBinary)(binaryName, enginePath);
  if (binaryName === import_fetch_engine.BinaryType.libqueryEngine) {
    await (0, import_get_platform.isNodeAPISupported)();
    const QE = (0, import_load.load)(enginePath);
    return `libquery-engine ${QE.version().commit}`;
  } else {
    const result = await (0, import_execa.default)(enginePath, ["--version"], {
      maxBuffer: MAX_BUFFER
    });
    return result.stdout;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getVersion
});
