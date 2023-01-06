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
var LibraryEngine_exports = {};
__export(LibraryEngine_exports, {
  LibraryEngine: () => LibraryEngine
});
module.exports = __toCommonJS(LibraryEngine_exports);
var import_debug = __toESM(require("@prisma/debug"));
var import_get_platform = require("@prisma/get-platform");
var import_chalk = __toESM(require("chalk"));
var import_events = __toESM(require("events"));
var import_fs = __toESM(require("fs"));
var import_Engine = require("../common/Engine");
var import_PrismaClientInitializationError = require("../common/errors/PrismaClientInitializationError");
var import_PrismaClientRustPanicError = require("../common/errors/PrismaClientRustPanicError");
var import_PrismaClientUnknownRequestError = require("../common/errors/PrismaClientUnknownRequestError");
var import_getErrorMessageWithLink = require("../common/errors/utils/getErrorMessageWithLink");
var import_prismaGraphQLToJSError = require("../common/errors/utils/prismaGraphQLToJSError");
var import_DefaultLibraryLoader = require("./DefaultLibraryLoader");
const debug = (0, import_debug.default)("prisma:client:libraryEngine");
function isQueryEvent(event) {
  return event["item_type"] === "query" && "query" in event;
}
__name(isQueryEvent, "isQueryEvent");
function isPanicEvent(event) {
  return event.level === "error" && event["message"] === "PANIC";
}
__name(isPanicEvent, "isPanicEvent");
const knownPlatforms = [...import_get_platform.platforms, "native"];
const engines = [];
class LibraryEngine extends import_Engine.Engine {
  constructor(config, loader = new import_DefaultLibraryLoader.DefaultLibraryLoader(config)) {
    var _a, _b;
    super();
    this.datamodel = import_fs.default.readFileSync(config.datamodelPath, "utf-8");
    this.config = config;
    this.libraryStarted = false;
    this.logQueries = (_a = config.logQueries) != null ? _a : false;
    this.logLevel = (_b = config.logLevel) != null ? _b : "error";
    this.libraryLoader = loader;
    this.logEmitter = new import_events.default();
    this.logEmitter.on("error", (e) => {
    });
    this.datasourceOverrides = config.datasources ? this.convertDatasources(config.datasources) : {};
    if (config.enableDebugLogs) {
      this.logLevel = "debug";
    }
    this.libraryInstantiationPromise = this.instantiateLibrary();
    initHooks();
    engines.push(this);
    this.checkForTooManyEngines();
  }
  checkForTooManyEngines() {
    if (engines.length >= 10) {
      const runningEngines = engines.filter((e) => e.engine);
      if (runningEngines.length === 10) {
        console.warn(`${import_chalk.default.yellow("warn(prisma-client)")} There are already 10 instances of Prisma Client actively running.`);
      }
    }
  }
  async transaction(action, arg) {
    var _a, _b, _c, _d, _e;
    await this.start();
    let result;
    if (action === "start") {
      const jsonOptions = JSON.stringify({
        max_wait: (_a = arg == null ? void 0 : arg.maxWait) != null ? _a : 2e3,
        timeout: (_b = arg == null ? void 0 : arg.timeout) != null ? _b : 5e3
      });
      result = await ((_c = this.engine) == null ? void 0 : _c.startTransaction(jsonOptions, "{}"));
    } else if (action === "commit") {
      result = await ((_d = this.engine) == null ? void 0 : _d.commitTransaction(arg.id, "{}"));
    } else if (action === "rollback") {
      result = await ((_e = this.engine) == null ? void 0 : _e.rollbackTransaction(arg.id, "{}"));
    }
    const response = this.parseEngineResponse(result);
    if (response.error_code)
      throw response;
    return response;
  }
  async instantiateLibrary() {
    debug("internalSetup");
    if (this.libraryInstantiationPromise) {
      return this.libraryInstantiationPromise;
    }
    await (0, import_get_platform.isNodeAPISupported)();
    this.platform = await this.getPlatform();
    await this.loadEngine();
    this.version();
  }
  async getPlatform() {
    if (this.platform)
      return this.platform;
    const platform = await (0, import_get_platform.getPlatform)();
    if (!knownPlatforms.includes(platform)) {
      throw new import_PrismaClientInitializationError.PrismaClientInitializationError(`Unknown ${import_chalk.default.red("PRISMA_QUERY_ENGINE_LIBRARY")} ${import_chalk.default.redBright.bold(platform)}. Possible binaryTargets: ${import_chalk.default.greenBright(knownPlatforms.join(", "))} or a path to the query engine library.
You may have to run ${import_chalk.default.greenBright("prisma generate")} for your changes to take effect.`, this.config.clientVersion);
    }
    return platform;
  }
  parseEngineResponse(response) {
    if (!response) {
      throw new import_PrismaClientUnknownRequestError.PrismaClientUnknownRequestError(`Response from the Engine was empty`, this.config.clientVersion);
    }
    try {
      const config = JSON.parse(response);
      return config;
    } catch (err) {
      throw new import_PrismaClientUnknownRequestError.PrismaClientUnknownRequestError(`Unable to JSON.parse response from engine`, this.config.clientVersion);
    }
  }
  convertDatasources(datasources) {
    const obj = /* @__PURE__ */ Object.create(null);
    for (const { name, url } of datasources) {
      obj[name] = url;
    }
    return obj;
  }
  async loadEngine() {
    var _a;
    if (!this.engine) {
      if (!this.QueryEngineConstructor) {
        this.library = await this.libraryLoader.loadLibrary();
        this.QueryEngineConstructor = this.library.QueryEngine;
      }
      try {
        this.engine = new this.QueryEngineConstructor({
          datamodel: this.datamodel,
          env: process.env,
          logQueries: (_a = this.config.logQueries) != null ? _a : false,
          ignoreEnvVarErrors: false,
          datasourceOverrides: this.datasourceOverrides,
          logLevel: this.logLevel,
          configDir: this.config.cwd
        }, (err, log) => this.logger(err, log));
      } catch (_e) {
        const e = _e;
        const error = this.parseInitError(e.message);
        if (typeof error === "string") {
          throw e;
        } else {
          throw new import_PrismaClientInitializationError.PrismaClientInitializationError(error.message, this.config.clientVersion, error.error_code);
        }
      }
    }
  }
  logger(err, log) {
    var _a;
    if (err) {
      throw err;
    }
    const event = this.parseEngineResponse(log);
    if (!event)
      return;
    event.level = (_a = event == null ? void 0 : event.level.toLowerCase()) != null ? _a : "unknown";
    if (isQueryEvent(event)) {
      this.logEmitter.emit("query", {
        timestamp: new Date(),
        query: event.query,
        params: event.params,
        duration: Number(event.duration_ms),
        target: event.module_path
      });
    } else if (isPanicEvent(event)) {
      this.loggerRustPanic = new import_PrismaClientRustPanicError.PrismaClientRustPanicError(this.getErrorMessageWithLink(`${event.message}: ${event.reason} in ${event.file}:${event.line}:${event.column}`), this.config.clientVersion);
      this.logEmitter.emit("error", this.loggerRustPanic);
    } else {
      this.logEmitter.emit(event.level, {
        timestamp: new Date(),
        message: event.message,
        target: event.module_path
      });
    }
  }
  getErrorMessageWithLink(title) {
    var _a;
    return (0, import_getErrorMessageWithLink.getErrorMessageWithLink)({
      platform: this.platform,
      title,
      version: this.config.clientVersion,
      engineVersion: (_a = this.versionInfo) == null ? void 0 : _a.commit,
      database: this.config.activeProvider,
      query: this.lastQuery
    });
  }
  parseInitError(str) {
    try {
      const error = JSON.parse(str);
      return error;
    } catch (e) {
    }
    return str;
  }
  parseRequestError(str) {
    try {
      const error = JSON.parse(str);
      return error;
    } catch (e) {
    }
    return str;
  }
  on(event, listener) {
    if (event === "beforeExit") {
      this.beforeExitListener = listener;
    } else {
      this.logEmitter.on(event, listener);
    }
  }
  async runBeforeExit() {
    debug("runBeforeExit");
    if (this.beforeExitListener) {
      try {
        await this.beforeExitListener();
      } catch (e) {
        console.error(e);
      }
    }
  }
  async start() {
    await this.libraryInstantiationPromise;
    await this.libraryStoppingPromise;
    if (this.libraryStartingPromise) {
      debug(`library already starting, this.libraryStarted: ${this.libraryStarted}`);
      return this.libraryStartingPromise;
    }
    if (!this.libraryStarted) {
      this.libraryStartingPromise = new Promise((resolve, reject) => {
        var _a;
        debug("library starting");
        (_a = this.engine) == null ? void 0 : _a.connect({ enableRawQueries: true }).then(() => {
          this.libraryStarted = true;
          debug("library started");
          resolve();
        }).catch((err) => {
          const error = this.parseInitError(err.message);
          if (typeof error === "string") {
            reject(err);
          } else {
            reject(new import_PrismaClientInitializationError.PrismaClientInitializationError(error.message, this.config.clientVersion, error.error_code));
          }
        }).finally(() => {
          this.libraryStartingPromise = void 0;
        });
      });
      return this.libraryStartingPromise;
    }
  }
  async stop() {
    await this.libraryStartingPromise;
    await this.executingQueryPromise;
    if (this.libraryStoppingPromise) {
      debug("library is already stopping");
      return this.libraryStoppingPromise;
    }
    if (this.libraryStarted) {
      this.libraryStoppingPromise = new Promise(async (resolve, reject) => {
        var _a;
        try {
          await new Promise((r) => setTimeout(r, 5));
          debug("library stopping");
          await ((_a = this.engine) == null ? void 0 : _a.disconnect());
          this.libraryStarted = false;
          this.libraryStoppingPromise = void 0;
          debug("library stopped");
          resolve();
        } catch (err) {
          reject(err);
        }
      });
      return this.libraryStoppingPromise;
    }
  }
  async getConfig() {
    await this.libraryInstantiationPromise;
    return this.library.getConfig({
      datamodel: this.datamodel,
      datasourceOverrides: this.datasourceOverrides,
      ignoreEnvVarErrors: true,
      env: process.env
    });
  }
  async getDmmf() {
    await this.libraryInstantiationPromise;
    return JSON.parse(await this.library.dmmf(this.datamodel));
  }
  version() {
    var _a, _b, _c;
    this.versionInfo = (_a = this.library) == null ? void 0 : _a.version();
    return (_c = (_b = this.versionInfo) == null ? void 0 : _b.version) != null ? _c : "unknown";
  }
  debugPanic(message) {
    var _a;
    return (_a = this.library) == null ? void 0 : _a.debugPanic(message);
  }
  async request(query, headers = {}, numTry = 1) {
    var _a, _b;
    debug(`sending request, this.libraryStarted: ${this.libraryStarted}`);
    const request = { query, variables: {} };
    const headerStr = JSON.stringify(headers);
    const queryStr = JSON.stringify(request);
    try {
      await this.start();
      this.executingQueryPromise = (_a = this.engine) == null ? void 0 : _a.query(queryStr, headerStr, headers.transactionId);
      this.lastQuery = queryStr;
      const data = this.parseEngineResponse(await this.executingQueryPromise);
      if (data.errors) {
        if (data.errors.length === 1) {
          throw this.buildQueryError(data.errors[0]);
        }
        throw new import_PrismaClientUnknownRequestError.PrismaClientUnknownRequestError(JSON.stringify(data.errors), this.config.clientVersion);
      } else if (this.loggerRustPanic) {
        throw this.loggerRustPanic;
      }
      return { data, elapsed: 0 };
    } catch (e) {
      if (e instanceof import_PrismaClientInitializationError.PrismaClientInitializationError) {
        throw e;
      }
      if (e.code === "GenericFailure" && ((_b = e.message) == null ? void 0 : _b.startsWith("PANIC:"))) {
        throw new import_PrismaClientRustPanicError.PrismaClientRustPanicError(this.getErrorMessageWithLink(e.message), this.config.clientVersion);
      }
      const error = this.parseRequestError(e.message);
      if (typeof error === "string") {
        throw e;
      } else {
        throw new import_PrismaClientUnknownRequestError.PrismaClientUnknownRequestError(`${error.message}
${error.backtrace}`, this.config.clientVersion);
      }
    }
  }
  async requestBatch(queries, headers = {}, transaction = false, numTry = 1) {
    debug("requestBatch");
    const request = {
      batch: queries.map((query) => ({ query, variables: {} })),
      transaction
    };
    await this.start();
    this.lastQuery = JSON.stringify(request);
    this.executingQueryPromise = this.engine.query(this.lastQuery, JSON.stringify(headers), headers.transactionId);
    const result = await this.executingQueryPromise;
    const data = this.parseEngineResponse(result);
    if (data.errors) {
      if (data.errors.length === 1) {
        throw this.buildQueryError(data.errors[0]);
      }
      throw new import_PrismaClientUnknownRequestError.PrismaClientUnknownRequestError(JSON.stringify(data.errors), this.config.clientVersion);
    }
    const { batchResult, errors } = data;
    if (Array.isArray(batchResult)) {
      return batchResult.map((result2) => {
        var _a;
        if (result2.errors) {
          return (_a = this.loggerRustPanic) != null ? _a : this.buildQueryError(data.errors[0]);
        }
        return {
          data: result2,
          elapsed: 0
        };
      });
    } else {
      if (errors && errors.length === 1) {
        throw new Error(errors[0].error);
      }
      throw new Error(JSON.stringify(data));
    }
  }
  buildQueryError(error) {
    if (error.user_facing_error.is_panic) {
      return new import_PrismaClientRustPanicError.PrismaClientRustPanicError(this.getErrorMessageWithLink(error.user_facing_error.message), this.config.clientVersion);
    }
    return (0, import_prismaGraphQLToJSError.prismaGraphQLToJSError)(error, this.config.clientVersion);
  }
  async metrics(options) {
    await this.start();
    const responseString = await this.engine.metrics(JSON.stringify(options));
    if (options.format === "prometheus") {
      return responseString;
    }
    return this.parseEngineResponse(responseString);
  }
}
__name(LibraryEngine, "LibraryEngine");
function hookProcess(handler, exit = false) {
  process.once(handler, async () => {
    debug(`hookProcess received: ${handler}`);
    for (const engine of engines) {
      await engine.runBeforeExit();
    }
    engines.splice(0, engines.length);
    if (exit && process.listenerCount(handler) === 0) {
      process.exit();
    }
  });
}
__name(hookProcess, "hookProcess");
let hooksInitialized = false;
function initHooks() {
  if (!hooksInitialized) {
    hookProcess("beforeExit");
    hookProcess("exit");
    hookProcess("SIGINT", true);
    hookProcess("SIGUSR2", true);
    hookProcess("SIGTERM", true);
    hooksInitialized = true;
  }
}
__name(initHooks, "initHooks");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  LibraryEngine
});
