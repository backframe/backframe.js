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
var BinaryEngine_exports = {};
__export(BinaryEngine_exports, {
  BinaryEngine: () => BinaryEngine
});
module.exports = __toCommonJS(BinaryEngine_exports);
var import_debug = __toESM(require("@prisma/debug"));
var import_engines = require("@prisma/engines");
var import_get_platform = require("@prisma/get-platform");
var import_chalk = __toESM(require("chalk"));
var import_child_process = require("child_process");
var import_events = __toESM(require("events"));
var import_execa = __toESM(require("execa"));
var import_fs = __toESM(require("fs"));
var import_net = __toESM(require("net"));
var import_p_retry = __toESM(require("p-retry"));
var import_path = __toESM(require("path"));
var import_url = require("url");
var import_util = require("util");
var import_Engine = require("../common/Engine");
var import_PrismaClientInitializationError = require("../common/errors/PrismaClientInitializationError");
var import_PrismaClientKnownRequestError = require("../common/errors/PrismaClientKnownRequestError");
var import_PrismaClientRustError = require("../common/errors/PrismaClientRustError");
var import_PrismaClientRustPanicError = require("../common/errors/PrismaClientRustPanicError");
var import_PrismaClientUnknownRequestError = require("../common/errors/PrismaClientUnknownRequestError");
var import_getErrorMessageWithLink = require("../common/errors/utils/getErrorMessageWithLink");
var import_log = require("../common/errors/utils/log");
var import_prismaGraphQLToJSError = require("../common/errors/utils/prismaGraphQLToJSError");
var import_printGeneratorConfig = require("../common/utils/printGeneratorConfig");
var import_util2 = require("../common/utils/util");
var import_byline = __toESM(require("../tools/byline"));
var import_omit = require("../tools/omit");
var import_Connection = require("./Connection");
const debug = (0, import_debug.default)("prisma:engine");
const exists = (0, import_util.promisify)(import_fs.default.exists);
const logger = /* @__PURE__ */ __name((...args) => {
}, "logger");
const knownPlatforms = [...import_get_platform.platforms, "native"];
const engines = [];
const socketPaths = [];
const MAX_STARTS = process.env.PRISMA_CLIENT_NO_RETRY ? 1 : 2;
const MAX_REQUEST_RETRIES = process.env.PRISMA_CLIENT_NO_RETRY ? 1 : 2;
class BinaryEngine extends import_Engine.Engine {
  constructor({
    cwd,
    datamodelPath,
    prismaPath,
    generator,
    datasources,
    showColors,
    logLevel,
    logQueries,
    env,
    flags,
    clientVersion,
    previewFeatures,
    engineEndpoint,
    enableDebugLogs,
    allowTriggerPanic,
    dirname,
    activeProvider
  }) {
    var _a;
    super();
    this.startCount = 0;
    this.previewFeatures = [];
    this.stderrLogs = "";
    this.handleRequestError = /* @__PURE__ */ __name(async (error, graceful = false) => {
      var _a, _b;
      debug({ error });
      if (this.startPromise) {
        await this.startPromise;
      }
      this.throwAsyncErrorIfExists();
      if ((_a = this.currentRequestPromise) == null ? void 0 : _a.isCanceled) {
        this.throwAsyncErrorIfExists();
      } else if (error.code === "ECONNRESET" || error.code === "ECONNREFUSED" || error.code === "UND_ERR_CLOSED" || error.code === "UND_ERR_SOCKET" || error.code === "UND_ERR_DESTROYED" || error.code === "UND_ERR_ABORTED" || error.message.toLowerCase().includes("client is destroyed") || error.message.toLowerCase().includes("other side closed") || error.message.toLowerCase().includes("the client is closed")) {
        if (this.globalKillSignalReceived && !((_b = this.child) == null ? void 0 : _b.connected)) {
          throw new import_PrismaClientUnknownRequestError.PrismaClientUnknownRequestError(`The Node.js process already received a ${this.globalKillSignalReceived} signal, therefore the Prisma query engine exited
and your request can't be processed.
You probably have some open handle that prevents your process from exiting.
It could be an open http server or stream that didn't close yet.
We recommend using the \`wtfnode\` package to debug open handles.`, this.clientVersion);
        }
        this.throwAsyncErrorIfExists();
        if (this.startCount > MAX_STARTS) {
          for (let i = 0; i < 5; i++) {
            await new Promise((r) => setTimeout(r, 50));
            this.throwAsyncErrorIfExists(true);
          }
          throw new Error(`Query engine is trying to restart, but can't.
Please look into the logs or turn on the env var DEBUG=* to debug the constantly restarting query engine.`);
        }
      }
      if (!graceful) {
        this.throwAsyncErrorIfExists(true);
        throw error;
      }
      return false;
    }, "handleRequestError");
    this.dirname = dirname;
    this.env = env;
    this.cwd = this.resolveCwd(cwd);
    this.enableDebugLogs = enableDebugLogs != null ? enableDebugLogs : false;
    this.allowTriggerPanic = allowTriggerPanic != null ? allowTriggerPanic : false;
    this.datamodelPath = datamodelPath;
    this.prismaPath = (_a = process.env.PRISMA_QUERY_ENGINE_BINARY) != null ? _a : prismaPath;
    this.generator = generator;
    this.datasources = datasources;
    this.logEmitter = new import_events.default();
    this.logEmitter.on("error", () => {
    });
    this.showColors = showColors != null ? showColors : false;
    this.logLevel = logLevel;
    this.logQueries = logQueries != null ? logQueries : false;
    this.clientVersion = clientVersion;
    this.flags = flags != null ? flags : [];
    this.previewFeatures = previewFeatures != null ? previewFeatures : [];
    this.activeProvider = activeProvider;
    this.connection = new import_Connection.Connection();
    initHooks();
    const removedFlags = [
      "middlewares",
      "aggregateApi",
      "distinct",
      "aggregations",
      "insensitiveFilters",
      "atomicNumberOperations",
      "transactionApi",
      "transaction",
      "connectOrCreate",
      "uncheckedScalarInputs",
      "nativeTypes",
      "createMany",
      "groupBy",
      "referentialActions",
      "microsoftSqlServer"
    ];
    const removedFlagsUsed = this.previewFeatures.filter((e) => removedFlags.includes(e));
    if (removedFlagsUsed.length > 0 && !process.env.PRISMA_HIDE_PREVIEW_FLAG_WARNINGS) {
      console.log(`${import_chalk.default.blueBright("info")} The preview flags \`${removedFlagsUsed.join("`, `")}\` were removed, you can now safely remove them from your schema.prisma.`);
    }
    this.previewFeatures = this.previewFeatures.filter((e) => !removedFlags.includes(e));
    this.engineEndpoint = engineEndpoint;
    if (engineEndpoint) {
      const url = new import_url.URL(engineEndpoint);
      this.port = Number(url.port);
    }
    if (this.platform) {
      if (!knownPlatforms.includes(this.platform) && !import_fs.default.existsSync(this.platform)) {
        throw new import_PrismaClientInitializationError.PrismaClientInitializationError(`Unknown ${import_chalk.default.red("PRISMA_QUERY_ENGINE_BINARY")} ${import_chalk.default.redBright.bold(this.platform)}. Possible binaryTargets: ${import_chalk.default.greenBright(knownPlatforms.join(", "))} or a path to the query engine binary.
You may have to run ${import_chalk.default.greenBright("prisma generate")} for your changes to take effect.`, this.clientVersion);
      }
    } else {
      void this.getPlatform();
    }
    if (this.enableDebugLogs) {
      import_debug.default.enable("*");
    }
    engines.push(this);
    this.checkForTooManyEngines();
  }
  setError(err) {
    var _a;
    if ((0, import_log.isRustError)(err)) {
      this.lastRustError = err;
      this.logEmitter.emit("error", new import_PrismaClientRustError.PrismaClientRustError({
        clientVersion: this.clientVersion,
        error: err
      }));
      if (err.is_panic) {
        this.handlePanic();
      }
    } else if ((0, import_log.isRustErrorLog)(err)) {
      this.lastErrorLog = err;
      this.logEmitter.emit("error", new import_PrismaClientRustError.PrismaClientRustError({
        clientVersion: this.clientVersion,
        log: err
      }));
      if (((_a = err.fields) == null ? void 0 : _a.message) === "PANIC") {
        this.handlePanic();
      }
    } else {
      this.logEmitter.emit("error", err);
    }
  }
  checkForTooManyEngines() {
    if (engines.length >= 10) {
      const runningEngines = engines.filter((e) => e.child);
      if (runningEngines.length === 10) {
        console.warn(`${import_chalk.default.yellow("warn(prisma-client)")} There are already 10 instances of Prisma Client actively running.`);
      }
    }
  }
  resolveCwd(cwd) {
    if (cwd && import_fs.default.existsSync(cwd) && import_fs.default.lstatSync(cwd).isDirectory()) {
      return cwd;
    }
    return process.cwd();
  }
  on(event, listener) {
    if (event === "beforeExit") {
      this.beforeExitListener = listener;
    } else {
      this.logEmitter.on(event, listener);
    }
  }
  async emitExit() {
    if (this.beforeExitListener) {
      try {
        await this.beforeExitListener();
      } catch (e) {
        console.error(e);
      }
    }
  }
  async getPlatform() {
    if (this.platformPromise) {
      return this.platformPromise;
    }
    this.platformPromise = (0, import_get_platform.getPlatform)();
    return this.platformPromise;
  }
  getQueryEnginePath(platform2, prefix = __dirname) {
    let queryEnginePath = import_path.default.join(prefix, `query-engine-${platform2}`);
    if (platform2 === "windows") {
      queryEnginePath = `${queryEnginePath}.exe`;
    }
    return queryEnginePath;
  }
  handlePanic() {
    var _a;
    if (this.child) {
      this.stopPromise = killProcessAndWait(this.child);
    }
    if ((_a = this.currentRequestPromise) == null ? void 0 : _a.cancel) {
      this.currentRequestPromise.cancel();
    }
  }
  async resolvePrismaPath() {
    var _a, _b, _c;
    const searchedLocations = [];
    let enginePath;
    if (this.prismaPath) {
      return { prismaPath: this.prismaPath, searchedLocations };
    }
    const platform = await this.getPlatform();
    if (this.platform && this.platform !== platform) {
      this.incorrectlyPinnedBinaryTarget = this.platform;
    }
    this.platform = this.platform || platform;
    if (__filename.includes("BinaryEngine")) {
      enginePath = this.getQueryEnginePath(this.platform, (0, import_engines.getEnginesPath)());
      return { prismaPath: enginePath, searchedLocations };
    }
    const searchLocations = [
      eval(`require('path').join(__dirname, '../../../.prisma/client')`),
      (_c = (_b = (_a = this.generator) == null ? void 0 : _a.output) == null ? void 0 : _b.value) != null ? _c : eval("__dirname"),
      import_path.default.join(eval("__dirname"), ".."),
      import_path.default.dirname(this.datamodelPath),
      this.cwd,
      "/tmp/prisma-engines"
    ];
    if (this.dirname) {
      searchLocations.push(this.dirname);
    }
    for (const location of searchLocations) {
      searchedLocations.push(location);
      debug(`Search for Query Engine in ${location}`);
      enginePath = this.getQueryEnginePath(this.platform, location);
      if (import_fs.default.existsSync(enginePath)) {
        return { prismaPath: enginePath, searchedLocations };
      }
    }
    enginePath = this.getQueryEnginePath(this.platform);
    return { prismaPath: enginePath != null ? enginePath : "", searchedLocations };
  }
  async getPrismaPath() {
    const { prismaPath, searchedLocations: searchedLocations2 } = await this.resolvePrismaPath();
    const platform2 = await this.getPlatform();
    if (!await exists(prismaPath)) {
      const pinnedStr = this.incorrectlyPinnedBinaryTarget ? `
You incorrectly pinned it to ${import_chalk.default.redBright.bold(`${this.incorrectlyPinnedBinaryTarget}`)}
` : "";
      let errorText = `Query engine binary for current platform "${import_chalk.default.bold(platform2)}" could not be found.${pinnedStr}
This probably happens, because you built Prisma Client on a different platform.
(Prisma Client looked in "${import_chalk.default.underline(prismaPath)}")

Searched Locations:

${searchedLocations2.map((f) => {
        let msg = `  ${f}`;
        if (process.env.DEBUG === "node-engine-search-locations" && import_fs.default.existsSync(f)) {
          const dir = import_fs.default.readdirSync(f);
          msg += dir.map((d) => `    ${d}`).join("\n");
        }
        return msg;
      }).join("\n" + (process.env.DEBUG === "node-engine-search-locations" ? "\n" : ""))}
`;
      if (this.generator) {
        if (this.generator.binaryTargets.find((object) => object.value === this.platform) || this.generator.binaryTargets.find((object) => object.value === "native")) {
          errorText += `
You already added the platform${this.generator.binaryTargets.length > 1 ? "s" : ""} ${this.generator.binaryTargets.map((t) => `"${import_chalk.default.bold(t.value)}"`).join(", ")} to the "${import_chalk.default.underline("generator")}" block
in the "schema.prisma" file as described in https://pris.ly/d/client-generator,
but something went wrong. That's suboptimal.

Please create an issue at https://github.com/prisma/prisma/issues/new`;
          errorText += ``;
        } else {
          errorText += `

To solve this problem, add the platform "${this.platform}" to the "${import_chalk.default.underline("binaryTargets")}" attribute in the "${import_chalk.default.underline("generator")}" block in the "schema.prisma" file:
${import_chalk.default.greenBright(this.getFixedGenerator())}

Then run "${import_chalk.default.greenBright("prisma generate")}" for your changes to take effect.
Read more about deploying Prisma Client: https://pris.ly/d/client-generator`;
        }
      } else {
        errorText += `

Read more about deploying Prisma Client: https://pris.ly/d/client-generator
`;
      }
      throw new import_PrismaClientInitializationError.PrismaClientInitializationError(errorText, this.clientVersion);
    }
    if (this.incorrectlyPinnedBinaryTarget) {
      console.error(`${import_chalk.default.yellow("Warning:")} You pinned the platform ${import_chalk.default.bold(this.incorrectlyPinnedBinaryTarget)}, but Prisma Client detects ${import_chalk.default.bold(await this.getPlatform())}.
This means you should very likely pin the platform ${import_chalk.default.greenBright(await this.getPlatform())} instead.
${import_chalk.default.dim("In case we're mistaken, please report this to us \u{1F64F}.")}`);
    }
    if (process.platform !== "win32") {
      (0, import_util2.plusX)(prismaPath);
    }
    return prismaPath;
  }
  getFixedGenerator() {
    const fixedGenerator = {
      ...this.generator,
      binaryTargets: (0, import_util2.fixBinaryTargets)(this.generator.binaryTargets, this.platform)
    };
    return (0, import_printGeneratorConfig.printGeneratorConfig)(fixedGenerator);
  }
  printDatasources() {
    if (this.datasources) {
      return JSON.stringify(this.datasources);
    }
    return "[]";
  }
  async start() {
    if (this.stopPromise) {
      await this.stopPromise;
    }
    if (!this.startPromise) {
      this.startCount++;
      this.startPromise = this.internalStart();
    }
    await this.startPromise;
    if (!this.child && !this.engineEndpoint) {
      throw new import_PrismaClientUnknownRequestError.PrismaClientUnknownRequestError(`Can't perform request, as the Engine has already been stopped`, this.clientVersion);
    }
    return this.startPromise;
  }
  getEngineEnvVars() {
    const env = {
      PRISMA_DML_PATH: this.datamodelPath,
      RUST_BACKTRACE: "1",
      RUST_LOG: "info"
    };
    if (this.logQueries || this.logLevel === "info") {
      env.RUST_LOG = "info";
      if (this.logQueries) {
        env.LOG_QUERIES = "true";
      }
    }
    if (this.datasources) {
      env.OVERWRITE_DATASOURCES = this.printDatasources();
    }
    if (!process.env.NO_COLOR && this.showColors) {
      env.CLICOLOR_FORCE = "1";
    }
    return {
      ...this.env,
      ...process.env,
      ...env
    };
  }
  internalStart() {
    return new Promise(async (resolve, reject) => {
      var _a, _b, _c;
      await new Promise((r) => process.nextTick(r));
      if (this.stopPromise) {
        await this.stopPromise;
      }
      if (this.engineEndpoint) {
        try {
          this.connection.open(this.engineEndpoint);
          await (0, import_p_retry.default)(() => this.connection.get("/status"), {
            retries: 10
          });
        } catch (e) {
          return reject(e);
        }
        return resolve();
      }
      try {
        if (((_a = this.child) == null ? void 0 : _a.connected) || this.child && !((_b = this.child) == null ? void 0 : _b.killed)) {
          debug(`There is a child that still runs and we want to start again`);
        }
        this.lastRustError = void 0;
        this.lastErrorLog = void 0;
        this.lastPanic = void 0;
        logger("startin & resettin");
        this.globalKillSignalReceived = void 0;
        debug({ cwd: this.cwd });
        const prismaPath = await this.getPrismaPath();
        const additionalFlag = this.allowTriggerPanic ? ["--debug"] : [];
        const flags = ["--enable-raw-queries", "--enable-metrics", ...this.flags, ...additionalFlag];
        this.port = await this.getFreePort();
        flags.push("--port", String(this.port));
        debug({ flags });
        const env = this.getEngineEnvVars();
        this.child = (0, import_child_process.spawn)(prismaPath, flags, {
          env,
          cwd: this.cwd,
          windowsHide: true,
          stdio: ["ignore", "pipe", "pipe"]
        });
        (0, import_byline.default)(this.child.stderr).on("data", (msg) => {
          const data = String(msg);
          debug("stderr", data);
          try {
            const json = JSON.parse(data);
            if (typeof json.is_panic !== "undefined") {
              debug(json);
              this.setError(json);
              if (this.engineStartDeferred) {
                const err = new import_PrismaClientInitializationError.PrismaClientInitializationError(json.message, this.clientVersion, json.error_code);
                this.engineStartDeferred.reject(err);
              }
            }
          } catch (e) {
            if (!data.includes("Printing to stderr") && !data.includes("Listening on ")) {
              this.stderrLogs += "\n" + data;
            }
          }
        });
        (0, import_byline.default)(this.child.stdout).on("data", (msg) => {
          var _a2, _b2;
          const data = String(msg);
          try {
            const json = JSON.parse(data);
            debug("stdout", (0, import_log.getMessage)(json));
            if (this.engineStartDeferred && json.level === "INFO" && json.target === "query_engine::server" && ((_b2 = (_a2 = json.fields) == null ? void 0 : _a2.message) == null ? void 0 : _b2.startsWith("Started query engine http server"))) {
              this.connection.open(`http://127.0.0.1:${this.port}`);
              this.engineStartDeferred.resolve();
              this.engineStartDeferred = void 0;
            }
            if (typeof json.is_panic === "undefined") {
              const log = (0, import_log.convertLog)(json);
              const logIsRustErrorLog = (0, import_log.isRustErrorLog)(log);
              if (logIsRustErrorLog) {
                this.setError(log);
              } else {
                this.logEmitter.emit(log.level, log);
              }
            } else {
              this.setError(json);
            }
          } catch (e) {
            debug(e, data);
          }
        });
        this.child.on("exit", (code) => {
          var _a2;
          logger("removing startPromise");
          this.startPromise = void 0;
          if (this.engineStopDeferred) {
            this.engineStopDeferred.resolve(code);
            return;
          }
          this.connection.close();
          if (code !== 0 && this.engineStartDeferred && this.startCount === 1) {
            let err;
            let msg = this.stderrLogs;
            if (this.lastRustError) {
              msg = (0, import_log.getMessage)(this.lastRustError);
            } else if (this.lastErrorLog) {
              msg = (0, import_log.getMessage)(this.lastErrorLog);
            }
            if (code !== null) {
              err = new import_PrismaClientInitializationError.PrismaClientInitializationError(`Query engine exited with code ${code}
` + msg, this.clientVersion);
            } else if ((_a2 = this.child) == null ? void 0 : _a2.signalCode) {
              err = new import_PrismaClientInitializationError.PrismaClientInitializationError(`Query engine process killed with signal ${this.child.signalCode} for unknown reason.
Make sure that the engine binary at ${prismaPath} is not corrupt.
` + msg, this.clientVersion);
            } else {
              err = new import_PrismaClientInitializationError.PrismaClientInitializationError(msg, this.clientVersion);
            }
            this.engineStartDeferred.reject(err);
          }
          if (!this.child) {
            return;
          }
          if (this.lastRustError) {
            return;
          }
          if (code === 126) {
            this.setError({
              timestamp: new Date(),
              target: "exit",
              level: "error",
              fields: {
                message: `Couldn't start query engine as it's not executable on this operating system.
You very likely have the wrong "binaryTarget" defined in the schema.prisma file.`
              }
            });
          }
        });
        this.child.on("error", (err) => {
          this.setError({
            message: err.message,
            backtrace: "Could not start query engine",
            is_panic: false
          });
          reject(err);
        });
        this.child.on("close", (code, signal) => {
          var _a2;
          this.connection.close();
          if (code === null && signal === "SIGABRT" && this.child) {
            const error = new import_PrismaClientRustPanicError.PrismaClientRustPanicError(this.getErrorMessageWithLink("Panic in Query Engine with SIGABRT signal"), this.clientVersion);
            this.logEmitter.emit("error", error);
          } else if (code === 255 && signal === null && ((_a2 = this.lastErrorLog) == null ? void 0 : _a2.fields.message) === "PANIC" && !this.lastPanic) {
            const error = new import_PrismaClientRustPanicError.PrismaClientRustPanicError(this.getErrorMessageWithLink(`${this.lastErrorLog.fields.message}: ${this.lastErrorLog.fields.reason} in ${this.lastErrorLog.fields.file}:${this.lastErrorLog.fields.line}:${this.lastErrorLog.fields.column}`), this.clientVersion);
            this.setError(error);
          }
        });
        if (this.lastRustError) {
          return reject(new import_PrismaClientInitializationError.PrismaClientInitializationError((0, import_log.getMessage)(this.lastRustError), this.clientVersion));
        }
        if (this.lastErrorLog) {
          return reject(new import_PrismaClientInitializationError.PrismaClientInitializationError((0, import_log.getMessage)(this.lastErrorLog), this.clientVersion));
        }
        try {
          await new Promise((resolve2, reject2) => {
            this.engineStartDeferred = { resolve: resolve2, reject: reject2 };
          });
        } catch (err) {
          (_c = this.child) == null ? void 0 : _c.kill();
          throw err;
        }
        void (async () => {
          try {
            const engineVersion = await this.version(true);
            debug(`Client Version: ${this.clientVersion}`);
            debug(`Engine Version: ${engineVersion}`);
            debug(`Active provider: ${this.activeProvider}`);
          } catch (e) {
            debug(e);
          }
        })();
        this.stopPromise = void 0;
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }
  async stop() {
    if (!this.stopPromise) {
      this.stopPromise = this._stop();
    }
    return this.stopPromise;
  }
  async _stop() {
    var _a;
    if (this.startPromise) {
      await this.startPromise;
    }
    await new Promise((resolve) => process.nextTick(resolve));
    if (this.currentRequestPromise) {
      try {
        await this.currentRequestPromise;
      } catch (e) {
      }
    }
    this.getConfigPromise = void 0;
    let stopChildPromise;
    if (this.child) {
      debug(`Stopping Prisma engine4`);
      if (this.startPromise) {
        debug(`Waiting for start promise`);
        await this.startPromise;
      }
      debug(`Done waiting for start promise`);
      stopChildPromise = new Promise((resolve, reject) => {
        this.engineStopDeferred = { resolve, reject };
      });
      this.connection.close();
      (_a = this.child) == null ? void 0 : _a.kill();
      this.child = void 0;
    }
    if (stopChildPromise) {
      await stopChildPromise;
    }
    await new Promise((r) => process.nextTick(r));
    this.startPromise = void 0;
    this.engineStopDeferred = void 0;
  }
  kill(signal) {
    var _a;
    this.getConfigPromise = void 0;
    this.globalKillSignalReceived = signal;
    (_a = this.child) == null ? void 0 : _a.kill();
    this.connection.close();
  }
  getFreePort() {
    return new Promise((resolve, reject) => {
      const server = import_net.default.createServer((s) => s.end(""));
      server.unref();
      server.on("error", reject);
      server.listen(0, () => {
        const address = server.address();
        const port = typeof address === "string" ? parseInt(address.split(":").slice(-1)[0], 10) : address.port;
        server.close((e) => {
          if (e) {
            reject(e);
          }
          resolve(port);
        });
      });
    });
  }
  async getConfig() {
    if (!this.getConfigPromise) {
      this.getConfigPromise = this._getConfig();
    }
    return this.getConfigPromise;
  }
  async _getConfig() {
    const prismaPath = await this.getPrismaPath();
    const env = await this.getEngineEnvVars();
    const result = await (0, import_execa.default)(prismaPath, ["cli", "get-config"], {
      env: (0, import_omit.omit)(env, ["PORT"]),
      cwd: this.cwd
    });
    return JSON.parse(result.stdout);
  }
  async getDmmf() {
    if (!this.getDmmfPromise) {
      this.getDmmfPromise = this._getDmmf();
    }
    return this.getDmmfPromise;
  }
  async _getDmmf() {
    const prismaPath = await this.getPrismaPath();
    const env = await this.getEngineEnvVars();
    const result = await (0, import_execa.default)(prismaPath, ["--enable-raw-queries", "cli", "dmmf"], {
      env: (0, import_omit.omit)(env, ["PORT"]),
      cwd: this.cwd
    });
    return JSON.parse(result.stdout);
  }
  async version(forceRun = false) {
    if (this.versionPromise && !forceRun) {
      return this.versionPromise;
    }
    this.versionPromise = this.internalVersion();
    return this.versionPromise;
  }
  async internalVersion() {
    const prismaPath = await this.getPrismaPath();
    const result = await (0, import_execa.default)(prismaPath, ["--version"]);
    this.lastVersion = result.stdout;
    return this.lastVersion;
  }
  async request(query, headers = {}, numTry = 1) {
    await this.start();
    this.currentRequestPromise = this.connection.post("/", stringifyQuery(query), runtimeHeadersToHttpHeaders(headers));
    this.lastQuery = query;
    try {
      const { data, headers: headers2 } = await this.currentRequestPromise;
      if (data.errors) {
        if (data.errors.length === 1) {
          throw (0, import_prismaGraphQLToJSError.prismaGraphQLToJSError)(data.errors[0], this.clientVersion);
        }
        throw new import_PrismaClientUnknownRequestError.PrismaClientUnknownRequestError(JSON.stringify(data.errors), this.clientVersion);
      }
      const elapsed = parseInt(headers2["x-elapsed"]) / 1e3;
      if (this.startCount > 0) {
        this.startCount = 0;
      }
      this.currentRequestPromise = void 0;
      return { data, elapsed };
    } catch (e) {
      logger("req - e", e);
      if (e instanceof import_PrismaClientKnownRequestError.PrismaClientKnownRequestError) {
        throw e;
      }
      await this.handleRequestError(e, numTry <= MAX_REQUEST_RETRIES);
      if (numTry <= MAX_REQUEST_RETRIES) {
        logger("trying a retry now");
        return this.request(query, headers, numTry + 1);
      }
    }
    return null;
  }
  async requestBatch(queries, headers = {}, transaction = false, numTry = 1) {
    await this.start();
    const request = {
      batch: queries.map((query) => ({ query, variables: {} })),
      transaction
    };
    this.lastQuery = JSON.stringify(request);
    this.currentRequestPromise = this.connection.post("/", this.lastQuery, runtimeHeadersToHttpHeaders(headers));
    return this.currentRequestPromise.then(({ data, headers: headers2 }) => {
      const elapsed = parseInt(headers2["x-elapsed"]) / 1e3;
      const { batchResult, errors } = data;
      if (Array.isArray(batchResult)) {
        return batchResult.map((result) => {
          if (result.errors) {
            throw (0, import_prismaGraphQLToJSError.prismaGraphQLToJSError)(data.errors[0], this.clientVersion);
          }
          return {
            data: result,
            elapsed
          };
        });
      } else {
        throw (0, import_prismaGraphQLToJSError.prismaGraphQLToJSError)(data.errors[0], this.clientVersion);
      }
    }).catch(async (e) => {
      const isError = await this.handleRequestError(e, numTry < 3);
      if (!isError) {
        if (numTry <= MAX_REQUEST_RETRIES) {
          return this.requestBatch(queries, headers, transaction, numTry + 1);
        }
      }
      throw isError;
    });
  }
  async transaction(action, arg) {
    var _a, _b;
    await this.start();
    if (action === "start") {
      const jsonOptions = JSON.stringify({
        max_wait: (_a = arg == null ? void 0 : arg.maxWait) != null ? _a : 2e3,
        timeout: (_b = arg == null ? void 0 : arg.timeout) != null ? _b : 5e3
      });
      const result = await import_Connection.Connection.onHttpError(this.connection.post("/transaction/start", jsonOptions), transactionHttpErrorHandler);
      return result.data;
    } else if (action === "commit") {
      await import_Connection.Connection.onHttpError(this.connection.post(`/transaction/${arg.id}/commit`), transactionHttpErrorHandler);
    } else if (action === "rollback") {
      await import_Connection.Connection.onHttpError(this.connection.post(`/transaction/${arg.id}/rollback`), transactionHttpErrorHandler);
    }
    return void 0;
  }
  get hasMaxRestarts() {
    return this.startCount >= MAX_STARTS;
  }
  throwAsyncErrorIfExists(forceThrow = false) {
    var _a, _b;
    logger("throwAsyncErrorIfExists", this.startCount, this.hasMaxRestarts);
    if (this.lastRustError) {
      const err = new import_PrismaClientRustPanicError.PrismaClientRustPanicError(this.getErrorMessageWithLink((0, import_log.getMessage)(this.lastRustError)), this.clientVersion);
      if (this.lastRustError.is_panic) {
        this.lastPanic = err;
      }
      if (this.hasMaxRestarts || forceThrow) {
        throw err;
      }
    }
    if (this.lastErrorLog && (0, import_log.isRustErrorLog)(this.lastErrorLog)) {
      const err = new import_PrismaClientUnknownRequestError.PrismaClientUnknownRequestError(this.getErrorMessageWithLink((0, import_log.getMessage)(this.lastErrorLog)), this.clientVersion);
      if (((_b = (_a = this.lastErrorLog) == null ? void 0 : _a.fields) == null ? void 0 : _b.message) === "PANIC") {
        this.lastPanic = err;
      }
      if (this.hasMaxRestarts || forceThrow) {
        throw err;
      }
    }
  }
  getErrorMessageWithLink(title) {
    return (0, import_getErrorMessageWithLink.getErrorMessageWithLink)({
      platform: this.platform,
      title,
      version: this.clientVersion,
      engineVersion: this.lastVersion,
      database: this.lastActiveProvider,
      query: this.lastQuery
    });
  }
  async metrics({ format, globalLabels }) {
    await this.start();
    const parseResponse = format === "json";
    const response = await this.connection.post(`/metrics?format=${encodeURIComponent(format)}`, JSON.stringify(globalLabels), null, parseResponse);
    return response.data;
  }
}
__name(BinaryEngine, "BinaryEngine");
function stringifyQuery(q) {
  return `{"variables":{},"query":${JSON.stringify(q)}}`;
}
__name(stringifyQuery, "stringifyQuery");
function hookProcess(handler, exit = false) {
  process.once(handler, async () => {
    for (const engine of engines) {
      await engine.emitExit();
      engine.kill(handler);
    }
    engines.splice(0, engines.length);
    if (socketPaths.length > 0) {
      for (const socketPath of socketPaths) {
        try {
          import_fs.default.unlinkSync(socketPath);
        } catch (e) {
        }
      }
    }
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
function transactionHttpErrorHandler(result) {
  throw result.data;
}
__name(transactionHttpErrorHandler, "transactionHttpErrorHandler");
function runtimeHeadersToHttpHeaders(headers) {
  return Object.keys(headers).reduce((acc, runtimeHeaderKey) => {
    let httpHeaderKey = runtimeHeaderKey;
    if (runtimeHeaderKey === "transactionId") {
      httpHeaderKey = "X-transaction-id";
    }
    acc[httpHeaderKey] = headers[runtimeHeaderKey];
    return acc;
  }, {});
}
__name(runtimeHeadersToHttpHeaders, "runtimeHeadersToHttpHeaders");
function killProcessAndWait(childProcess) {
  return new Promise((resolve) => {
    childProcess.once("exit", resolve);
    childProcess.kill();
  });
}
__name(killProcessAndWait, "killProcessAndWait");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BinaryEngine
});
