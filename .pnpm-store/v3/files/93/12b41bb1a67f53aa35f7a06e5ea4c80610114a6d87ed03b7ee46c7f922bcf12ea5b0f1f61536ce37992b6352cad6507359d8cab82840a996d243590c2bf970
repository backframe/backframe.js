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
var IntrospectionEngine_exports = {};
__export(IntrospectionEngine_exports, {
  IntrospectionEngine: () => IntrospectionEngine,
  IntrospectionError: () => IntrospectionError,
  IntrospectionPanic: () => IntrospectionPanic
});
module.exports = __toCommonJS(IntrospectionEngine_exports);
var import_debug = __toESM(require("@prisma/debug"));
var import_fetch_engine = require("@prisma/fetch-engine");
var import_chalk = __toESM(require("chalk"));
var import_child_process = require("child_process");
var import_panic = require("./panic");
var import_resolveBinary = require("./resolveBinary");
var import_byline = __toESM(require("./utils/byline"));
const debugCli = (0, import_debug.default)("prisma:introspectionEngine:cli");
const debugRpc = (0, import_debug.default)("prisma:introspectionEngine:rpc");
const debugStderr = (0, import_debug.default)("prisma:introspectionEngine:stderr");
const debugStdin = (0, import_debug.default)("prisma:introspectionEngine:stdin");
class IntrospectionPanic extends Error {
  constructor(message, rustStack, request) {
    super(message);
    this.rustStack = rustStack;
    this.request = request;
  }
}
__name(IntrospectionPanic, "IntrospectionPanic");
class IntrospectionError extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
  }
}
__name(IntrospectionError, "IntrospectionError");
let messageId = 1;
class IntrospectionEngine {
  constructor({ debug, cwd } = {
    debug: false,
    cwd: process.cwd()
  }) {
    this.listeners = {};
    this.messages = [];
    this.isRunning = false;
    if (debug) {
      import_debug.default.enable("IntrospectionEngine*");
    }
    this.debug = Boolean(debug);
    this.cwd = cwd || process.cwd();
  }
  stop() {
    if (this.child) {
      this.child.kill();
      this.isRunning = false;
    }
  }
  rejectAll(err) {
    Object.entries(this.listeners).map(([id, listener]) => {
      listener(null, err);
      delete this.listeners[id];
    });
  }
  registerCallback(id, callback) {
    this.listeners[id] = callback;
  }
  getDatabaseDescription(schema) {
    return this.runCommand(this.getRPCPayload("getDatabaseDescription", { schema }));
  }
  getDatabaseVersion(schema) {
    return this.runCommand(this.getRPCPayload("getDatabaseVersion", { schema }));
  }
  introspect(schema, force, compositeTypeDepth = -1) {
    this.lastUrl = schema;
    return this.runCommand(this.getRPCPayload("introspect", { schema, force, compositeTypeDepth }));
  }
  debugPanic() {
    return this.runCommand(this.getRPCPayload("debugPanic", void 0));
  }
  listDatabases(schema) {
    this.lastUrl = schema;
    return this.runCommand(this.getRPCPayload("listDatabases", { schema }));
  }
  getDatabaseMetadata(schema) {
    this.lastUrl = schema;
    return this.runCommand(this.getRPCPayload("getDatabaseMetadata", { schema }));
  }
  handleResponse(response) {
    let result;
    try {
      result = JSON.parse(response);
    } catch (e) {
      console.error(`Could not parse introspection engine response: ${response.slice(0, 200)}`);
    }
    if (result) {
      if (result.backtrace) {
        console.log(result);
      }
      if (!result.id) {
        console.error(`Response ${JSON.stringify(result)} doesn't have an id and I can't handle that (yet)`);
      }
      if (!this.listeners[result.id]) {
        console.error(`Got result for unknown id ${result.id}`);
      }
      if (this.listeners[result.id]) {
        this.listeners[result.id](result);
        delete this.listeners[result.id];
      }
    }
  }
  init() {
    if (!this.initPromise) {
      this.initPromise = this.internalInit();
    }
    return this.initPromise;
  }
  internalInit() {
    return new Promise(async (resolve, reject) => {
      var _a, _b;
      try {
        const binaryPath = await (0, import_resolveBinary.resolveBinary)(import_fetch_engine.BinaryType.introspectionEngine);
        debugRpc("starting introspection engine with binary: " + binaryPath);
        this.child = (0, import_child_process.spawn)(binaryPath, {
          env: process.env,
          cwd: this.cwd,
          stdio: ["pipe", "pipe", "pipe"]
        });
        this.isRunning = true;
        this.child.on("error", (err) => {
          var _a2;
          console.error("[introspection-engine] error: %s", err);
          (_a2 = this.child) == null ? void 0 : _a2.kill();
          this.rejectAll(err);
          reject(err);
        });
        (_a = this.child.stdin) == null ? void 0 : _a.on("error", (err) => {
          var _a2;
          console.error(err);
          (_a2 = this.child) == null ? void 0 : _a2.kill();
        });
        this.child.on("exit", (code) => {
          this.isRunning = false;
          if (code === 255 && this.lastError && this.lastError.is_panic) {
            const err2 = new import_panic.RustPanic(this.lastError.message, this.lastError.backtrace, this.lastRequest, import_panic.ErrorArea.INTROSPECTION_CLI, void 0, this.lastUrl);
            this.rejectAll(err2);
            reject(err2);
            return;
          }
          const messages = this.messages.join("\n");
          let err;
          if (code !== 0 || messages.includes("panicked at")) {
            let errorMessage = import_chalk.default.red.bold("Error in introspection engine: ") + messages;
            if (this.lastError && this.lastError.msg === "PANIC") {
              errorMessage = serializePanic(this.lastError);
              err = new IntrospectionPanic(errorMessage, messages, this.lastRequest);
            } else if (messages.includes("panicked at")) {
              err = new IntrospectionPanic(errorMessage, messages, this.lastRequest);
            }
            err = err || new Error(errorMessage);
            this.rejectAll(err);
            reject(err);
          }
        });
        this.child.stdin.on("error", (err) => {
          debugStdin(err);
        });
        (0, import_byline.default)(this.child.stderr).on("data", (data) => {
          const msg = String(data);
          this.messages.push(msg);
          debugStderr(msg);
          try {
            const json = JSON.parse(msg);
            if (json.backtrace) {
              this.lastError = json;
            }
            if (json.level === "ERRO") {
              this.lastError = json;
            }
          } catch (e) {
            debugCli(e);
          }
        });
        (0, import_byline.default)(this.child.stdout).on("data", (line) => {
          this.handleResponse(String(line));
        });
        setImmediate(() => {
          resolve();
        });
      } catch (e) {
        (_b = this.child) == null ? void 0 : _b.kill();
        reject(e);
      }
    });
  }
  async runCommand(request) {
    var _a;
    await this.init();
    if (process.env.FORCE_PANIC_INTROSPECTION_ENGINE) {
      request = this.getRPCPayload("debugPanic", void 0);
    }
    if ((_a = this.child) == null ? void 0 : _a.killed) {
      throw new Error(`Can't execute ${JSON.stringify(request)} because introspection engine already exited.`);
    }
    return new Promise((resolve, reject) => {
      this.registerCallback(request.id, (response, err) => {
        var _a2, _b, _c, _d, _e, _f, _g;
        if (err) {
          return reject(err);
        }
        if (typeof response.result !== "undefined") {
          resolve(response.result);
        } else {
          if (response.error) {
            (_a2 = this.child) == null ? void 0 : _a2.kill();
            debugRpc(response);
            if ((_b = response.error.data) == null ? void 0 : _b.is_panic) {
              const message = (_e = (_d = (_c = response.error.data) == null ? void 0 : _c.error) == null ? void 0 : _d.message) != null ? _e : response.error.message;
              reject(new import_panic.RustPanic(message, message, request, import_panic.ErrorArea.INTROSPECTION_CLI, void 0, this.lastUrl));
            } else if ((_f = response.error.data) == null ? void 0 : _f.message) {
              let message = `${response.error.data.message}
`;
              if ((_g = response.error.data) == null ? void 0 : _g.error_code) {
                message = import_chalk.default.redBright(`${response.error.data.error_code}

`) + message;
                reject(new IntrospectionError(message, response.error.data.error_code));
              } else {
                reject(new Error(message));
              }
            } else {
              reject(new Error(`${import_chalk.default.redBright("Error in RPC")}
 Request: ${JSON.stringify(request, null, 2)}
Response: ${JSON.stringify(response, null, 2)}
${response.error.message}
`));
            }
          } else {
            reject(new Error(`Got invalid RPC response without .result property: ${JSON.stringify(response)}`));
          }
        }
      });
      if (this.child.stdin.destroyed) {
        throw new Error(`Can't execute ${JSON.stringify(request)} because introspection engine is destroyed.`);
      }
      debugRpc("SENDING RPC CALL", JSON.stringify(request));
      this.child.stdin.write(JSON.stringify(request) + "\n");
      this.lastRequest = request;
    });
  }
  getRPCPayload(method, params) {
    return {
      id: messageId++,
      jsonrpc: "2.0",
      method,
      params: params ? [{ ...params }] : void 0
    };
  }
}
__name(IntrospectionEngine, "IntrospectionEngine");
function serializePanic(log) {
  return `${import_chalk.default.red.bold("Error in introspection engine.\nReason: ")}
${log.reason} in ${import_chalk.default.underline(`${log.file}:${log.line}:${log.column}`)}

Please create an issue in the ${import_chalk.default.bold("prisma")} repo with the error \u{1F64F}:
${import_chalk.default.underline("https://github.com/prisma/prisma/issues/new")}
`;
}
__name(serializePanic, "serializePanic");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  IntrospectionEngine,
  IntrospectionError,
  IntrospectionPanic
});
