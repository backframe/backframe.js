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
  getDMMF: () => getDMMF
});
var import_debug = __toModule(require("@prisma/debug"));
var import_engines = __toModule(require("@prisma/engines"));
var import_fetch_engine = __toModule(require("@prisma/fetch-engine"));
var import_get_platform = __toModule(require("@prisma/get-platform"));
var import_chalk = __toModule(require("chalk"));
var import_execa = __toModule(require("execa"));
var import_fs = __toModule(require("fs"));
var import_temp_write = __toModule(require("temp-write"));
var import_util = __toModule(require("util"));
var import_resolveBinary = __toModule(require("../resolveBinary"));
var import_load = __toModule(require("../utils/load"));
const debug = (0, import_debug.default)("prisma:getDMMF");
const unlink = (0, import_util.promisify)(import_fs.default.unlink);
const MAX_BUFFER = 1e9;
async function getDMMF(options) {
  warnOnDeprecatedFeatureFlag(options.previewFeatures);
  const cliEngineBinaryType = (0, import_engines.getCliQueryEngineBinaryType)();
  let dmmf;
  if (cliEngineBinaryType === import_fetch_engine.BinaryType.libqueryEngine) {
    dmmf = await getDmmfNodeAPI(options);
  } else {
    dmmf = await getDmmfBinary(options);
  }
  return dmmf;
}
async function getDmmfNodeAPI(options) {
  var _a;
  const queryEnginePath = await (0, import_resolveBinary.resolveBinary)(import_fetch_engine.BinaryType.libqueryEngine, options.prismaPath);
  await (0, import_get_platform.isNodeAPISupported)();
  debug(`Using Node-API Query Engine at: ${queryEnginePath}`);
  const NodeAPIQueryEngineLibrary = (0, import_load.load)(queryEnginePath);
  const datamodel = (_a = options.datamodel) != null ? _a : import_fs.default.readFileSync(options.datamodelPath, "utf-8");
  let dmmf;
  try {
    dmmf = JSON.parse(await NodeAPIQueryEngineLibrary.dmmf(datamodel));
  } catch (e) {
    const error = JSON.parse(e.message);
    const message = addMissingOpenSSLInfo(error.message);
    throw new Error(import_chalk.default.redBright.bold("Schema parsing\n") + message);
  }
  return dmmf;
}
async function getDmmfBinary(options) {
  let result;
  const queryEnginePath = await (0, import_resolveBinary.resolveBinary)(import_fetch_engine.BinaryType.queryEngine, options.prismaPath);
  debug(`Using Query Engine Binary at: ${queryEnginePath}`);
  try {
    let tempDatamodelPath = options.datamodelPath;
    if (!tempDatamodelPath) {
      try {
        tempDatamodelPath = await (0, import_temp_write.default)(options.datamodel);
      } catch (err) {
        throw new Error(import_chalk.default.redBright.bold("Get DMMF ") + "unable to write temp data model path");
      }
    }
    const execaOptions = {
      cwd: options.cwd,
      env: {
        PRISMA_DML_PATH: tempDatamodelPath,
        RUST_BACKTRACE: "1",
        ...process.env.NO_COLOR ? {} : { CLICOLOR_FORCE: "1" }
      },
      maxBuffer: MAX_BUFFER
    };
    const args = ["--enable-raw-queries", "cli", "dmmf"];
    result = await (0, import_execa.default)(queryEnginePath, args, execaOptions);
    if (!options.datamodelPath) {
      await unlink(tempDatamodelPath);
    }
    if (result.stdout.includes("Please wait until the") && options.retry && options.retry > 0) {
      debug('Retrying after "Please wait until"');
      await new Promise((r) => setTimeout(r, 5e3));
      return getDMMF({
        ...options,
        retry: options.retry - 1
      });
    }
    const firstCurly = result.stdout.indexOf("{");
    const stdout = result.stdout.slice(firstCurly);
    return JSON.parse(stdout);
  } catch (e) {
    debug("getDMMF failed", e);
    if (e.message.includes("Command failed with exit code 26 (ETXTBSY)") && options.retry && options.retry > 0) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      debug("Retrying after ETXTBSY");
      return getDMMF({
        ...options,
        retry: options.retry - 1
      });
    }
    const output = e.stderr || e.stdout;
    if (output) {
      let json;
      try {
        json = JSON.parse(output);
      } catch (e2) {
      }
      let message = json && json.message || output;
      message = addMissingOpenSSLInfo(message);
      throw new Error(import_chalk.default.redBright.bold("Schema parsing\n") + message);
    }
    if (e.message.includes("in JSON at position")) {
      throw new Error(`Problem while parsing the query engine response at ${queryEnginePath}. ${result == null ? void 0 : result.stdout}
${e.stack}`);
    }
    throw new Error(e);
  }
}
function addMissingOpenSSLInfo(message) {
  if (message.includes("debian-openssl-1.1.x: error while loading shared libraries: libssl.so.1.1: cannot open shared object file: No such file or directory") || message.includes("debian-openssl-1.0.x: error while loading shared libraries: libssl.so.1.0.0: cannot open shared object file: No such file or directory")) {
    message += `
${import_chalk.default.green(`Your linux installation misses the openssl package. You can install it like so:
`)}${import_chalk.default.green.bold("apt-get -qy update && apt-get -qy install openssl")}`;
  }
  return message;
}
function warnOnDeprecatedFeatureFlag(previewFeatures) {
  const getMessage = (flag) => `${import_chalk.default.blueBright("info")} The preview flag "${flag}" is not needed anymore, please remove it from your schema.prisma`;
  const removedFeatureFlagMap = {
    insensitiveFilters: getMessage("insensitiveFilters"),
    atomicNumberOperations: getMessage("atomicNumberOperations"),
    connectOrCreate: getMessage("connectOrCreate"),
    transaction: getMessage("transaction"),
    transactionApi: getMessage("transactionApi"),
    uncheckedScalarInputs: getMessage("uncheckedScalarInputs"),
    nativeTypes: getMessage("nativeTypes"),
    createMany: getMessage("createMany"),
    groupBy: getMessage("groupBy")
  };
  previewFeatures == null ? void 0 : previewFeatures.forEach((f) => {
    const removedMessage = removedFeatureFlagMap[f];
    if (removedMessage && !process.env.PRISMA_HIDE_PREVIEW_FLAG_WARNINGS) {
      console.warn(removedMessage);
    }
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getDMMF
});
