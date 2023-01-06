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
var sendPanic_exports = {};
__export(sendPanic_exports, {
  sendPanic: () => sendPanic
});
module.exports = __toCommonJS(sendPanic_exports);
var import_debug = __toESM(require("@prisma/debug"));
var import_get_platform = require("@prisma/get-platform");
var import_archiver = __toESM(require("archiver"));
var checkpoint = __toESM(require("checkpoint-client"));
var import_fs = __toESM(require("fs"));
var import_globby = __toESM(require("globby"));
var import_os = __toESM(require("os"));
var import_path = __toESM(require("path"));
var import_strip_ansi = __toESM(require("strip-ansi"));
var import_tmp = __toESM(require("tmp"));
var import_ts_pattern = require("ts-pattern");
var import_errorReporting = require("./errorReporting");
var import_IntrospectionEngine = require("./IntrospectionEngine");
var import_panic = require("./panic");
var import_maskSchema = require("./utils/maskSchema");
const debug = (0, import_debug.default)("prisma:sendPanic");
import_tmp.default.setGracefulCleanup();
async function sendPanic(error, cliVersion, engineVersion) {
  try {
    const schema = (0, import_ts_pattern.match)(error).with({ schemaPath: import_ts_pattern.P.when((schemaPath) => Boolean(schemaPath)) }, (err) => {
      return import_fs.default.readFileSync(err.schemaPath, "utf-8");
    }).with({ schema: import_ts_pattern.P.when((schema2) => Boolean(schema2)) }, (err) => err.schema).otherwise(() => void 0);
    const maskedSchema = schema ? (0, import_maskSchema.maskSchema)(schema) : void 0;
    let sqlDump;
    let dbVersion;
    const schemaOrUrl = schema || error.introspectionUrl;
    if (error.area === import_panic.ErrorArea.INTROSPECTION_CLI && schemaOrUrl) {
      let engine;
      try {
        engine = new import_IntrospectionEngine.IntrospectionEngine();
        sqlDump = await engine.getDatabaseDescription(schemaOrUrl);
        dbVersion = await engine.getDatabaseVersion(schemaOrUrl);
        engine.stop();
      } catch (e) {
        debug(e);
        if (engine && engine.isRunning) {
          engine.stop();
        }
      }
    }
    const migrateRequest = error.request ? JSON.stringify((0, import_maskSchema.mapScalarValues)(error.request, (value) => {
      if (typeof value === "string") {
        return (0, import_maskSchema.maskSchema)(value);
      }
      return value;
    })) : void 0;
    const params = {
      area: error.area,
      kind: import_errorReporting.ErrorKind.RUST_PANIC,
      cliVersion,
      binaryVersion: engineVersion,
      command: getCommand(),
      jsStackTrace: (0, import_strip_ansi.default)(error.stack || error.message),
      rustStackTrace: error.rustStack,
      operatingSystem: `${import_os.default.arch()} ${import_os.default.platform()} ${import_os.default.release()}`,
      platform: await (0, import_get_platform.getPlatform)(),
      liftRequest: migrateRequest,
      schemaFile: maskedSchema,
      fingerprint: await checkpoint.getSignature(),
      sqlDump,
      dbVersion
    };
    const signedUrl = await (0, import_errorReporting.createErrorReport)(params);
    if (error.schemaPath) {
      const zip = await makeErrorZip(error);
      await (0, import_errorReporting.uploadZip)(zip, signedUrl);
    }
    const id = await (0, import_errorReporting.makeErrorReportCompleted)(signedUrl);
    return id;
  } catch (e) {
    debug(e);
    throw e;
  }
}
__name(sendPanic, "sendPanic");
function getCommand() {
  if (process.argv[2] === "introspect") {
    return "introspect";
  } else if (process.argv[2] === "db" && process.argv[3] === "pull") {
    return "db pull";
  }
  return process.argv.slice(2).join(" ");
}
__name(getCommand, "getCommand");
async function makeErrorZip(error) {
  if (!error.schemaPath) {
    throw new Error(`Can't make zip without schema path`);
  }
  const schemaDir = import_path.default.dirname(error.schemaPath);
  const tmpFileObj = import_tmp.default.fileSync();
  const outputFile = import_fs.default.createWriteStream(tmpFileObj.name);
  const zip = (0, import_archiver.default)("zip", { zlib: { level: 9 } });
  zip.pipe(outputFile);
  const schemaFile = (0, import_maskSchema.maskSchema)(import_fs.default.readFileSync(error.schemaPath, "utf-8"));
  zip.append(schemaFile, { name: import_path.default.basename(error.schemaPath) });
  if (import_fs.default.existsSync(schemaDir)) {
    const filePaths = await (0, import_globby.default)("migrations/**/*", {
      cwd: schemaDir
    });
    for (const filePath of filePaths) {
      let file = import_fs.default.readFileSync(import_path.default.resolve(schemaDir, filePath), "utf-8");
      if (filePath.endsWith("schema.prisma") || filePath.endsWith(import_path.default.basename(error.schemaPath))) {
        file = (0, import_maskSchema.maskSchema)(file);
      }
      zip.append(file, { name: import_path.default.basename(filePath) });
    }
  }
  zip.finalize();
  return new Promise((resolve, reject) => {
    outputFile.on("close", () => {
      const buffer = import_fs.default.readFileSync(tmpFileObj.name);
      resolve(buffer);
    });
    zip.on("error", (err) => {
      reject(err);
    });
  });
}
__name(makeErrorZip, "makeErrorZip");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  sendPanic
});
