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
  ErrorKind: () => ErrorKind,
  createErrorReport: () => createErrorReport,
  makeErrorReportCompleted: () => makeErrorReportCompleted,
  sendPanic: () => sendPanic
});
var import_get_platform = __toModule(require("@prisma/get-platform"));
var import_archiver = __toModule(require("archiver"));
var import_debug = __toModule(require("@prisma/debug"));
var import_fs = __toModule(require("fs"));
var import_globby = __toModule(require("globby"));
var import_node_fetch = __toModule(require("node-fetch"));
var import_os = __toModule(require("os"));
var import_path = __toModule(require("path"));
var import_strip_ansi = __toModule(require("strip-ansi"));
var import_tmp = __toModule(require("tmp"));
var checkpoint = __toModule(require("checkpoint-client"));
var import_maskSchema = __toModule(require("./utils/maskSchema"));
var import_panic = __toModule(require("./panic"));
var import_fetch_engine = __toModule(require("@prisma/fetch-engine"));
var import_IntrospectionEngine = __toModule(require("./IntrospectionEngine"));
const debug = (0, import_debug.default)("prisma:sendPanic");
import_tmp.default.setGracefulCleanup();
async function sendPanic(error, cliVersion, binaryVersion) {
  try {
    let schema;
    let maskedSchema;
    if (error.schemaPath) {
      schema = import_fs.default.readFileSync(error.schemaPath, "utf-8");
    }
    if (error.schema) {
      schema = error.schema;
    }
    if (schema) {
      maskedSchema = (0, import_maskSchema.maskSchema)(schema);
    }
    let sqlDump;
    let dbVersion;
    const schemaOrUrl = error.schema || error.introspectionUrl;
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
      kind: ErrorKind.RUST_PANIC,
      cliVersion,
      binaryVersion,
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
    const signedUrl = await createErrorReport(params);
    if (error.schemaPath) {
      const zip = await makeErrorZip(error);
      await uploadZip(zip, signedUrl);
    }
    const id = await makeErrorReportCompleted(signedUrl);
    return id;
  } catch (e) {
    debug(e);
  }
}
function getCommand() {
  if (process.argv[2] === "introspect") {
    return "introspect";
  } else if (process.argv[2] === "db" && process.argv[3] === "pull") {
    return "db pull";
  }
  return process.argv.slice(2).join(" ");
}
async function uploadZip(zip, url) {
  return await (0, import_node_fetch.default)(url, {
    method: "PUT",
    agent: (0, import_fetch_engine.getProxyAgent)(url),
    headers: {
      "Content-Length": String(zip.byteLength)
    },
    body: zip
  });
}
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
var ErrorKind;
(function(ErrorKind2) {
  ErrorKind2["JS_ERROR"] = "JS_ERROR";
  ErrorKind2["RUST_PANIC"] = "RUST_PANIC";
})(ErrorKind || (ErrorKind = {}));
async function createErrorReport(data) {
  const result = await request(`mutation ($data: CreateErrorReportInput!) {
    createErrorReport(data: $data)
  }`, { data });
  return result.createErrorReport;
}
async function makeErrorReportCompleted(signedUrl) {
  const result = await request(`mutation ($signedUrl: String!) {
  markErrorReportCompleted(signedUrl: $signedUrl)
}`, { signedUrl });
  return result.markErrorReportCompleted;
}
async function request(query, variables) {
  const url = "https://error-reports.prisma.sh/";
  const body = JSON.stringify({
    query,
    variables
  });
  return await (0, import_node_fetch.default)(url, {
    method: "POST",
    agent: (0, import_fetch_engine.getProxyAgent)(url),
    body,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  }).then((res) => res.json()).then((res) => {
    if (res.errors) {
      throw new Error(JSON.stringify(res.errors));
    }
    return res.data;
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ErrorKind,
  createErrorReport,
  makeErrorReportCompleted,
  sendPanic
});
