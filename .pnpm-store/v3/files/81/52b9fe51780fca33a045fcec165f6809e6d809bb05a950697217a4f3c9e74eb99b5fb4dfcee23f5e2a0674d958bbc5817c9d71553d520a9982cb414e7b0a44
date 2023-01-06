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
  GeneratorError: () => GeneratorError,
  GeneratorProcess: () => GeneratorProcess
});
var import_child_process = __toModule(require("child_process"));
var import_cross_spawn = __toModule(require("cross-spawn"));
var import_byline = __toModule(require("./byline"));
var import_chalk = __toModule(require("chalk"));
var import_debug = __toModule(require("@prisma/debug"));
const debug = (0, import_debug.default)("prisma:GeneratorProcess");
let globalMessageId = 1;
class GeneratorError extends Error {
  constructor(message, code, data) {
    super(message);
    this.code = code;
    this.data = data;
  }
}
class GeneratorProcess {
  constructor(executablePath, isNode) {
    this.executablePath = executablePath;
    this.isNode = isNode;
    this.listeners = {};
    this.exitCode = null;
    this.stderrLogs = "";
  }
  async init() {
    if (!this.initPromise) {
      this.initPromise = this.initSingleton();
    }
    return this.initPromise;
  }
  initSingleton() {
    return new Promise((resolve, reject) => {
      try {
        if (this.isNode) {
          this.child = (0, import_child_process.fork)(this.executablePath, [], {
            stdio: ["pipe", "inherit", "pipe", "ipc"],
            env: {
              ...process.env,
              PRISMA_GENERATOR_INVOCATION: "true"
            },
            execArgv: ["--max-old-space-size=8096"]
          });
        } else {
          this.child = (0, import_cross_spawn.spawn)(this.executablePath, {
            stdio: ["pipe", "inherit", "pipe"],
            env: {
              ...process.env,
              PRISMA_GENERATOR_INVOCATION: "true"
            },
            shell: true
          });
        }
        this.child.on("exit", (code) => {
          this.exitCode = code;
          if (code && code > 0 && this.currentGenerateDeferred) {
            this.currentGenerateDeferred.reject(new Error(this.stderrLogs.split("\n").slice(-5).join("\n")));
          }
        });
        this.child.on("error", (err) => {
          this.lastError = err;
          if (err.message.includes("EACCES")) {
            reject(new Error(`The executable at ${this.executablePath} lacks the right chmod. Please use ${import_chalk.default.bold(`chmod +x ${this.executablePath}`)}`));
          } else {
            reject(err);
          }
        });
        (0, import_byline.default)(this.child.stderr).on("data", (line) => {
          const response = String(line);
          this.stderrLogs += response + "\n";
          let data;
          try {
            data = JSON.parse(response);
          } catch (e) {
            debug(response);
          }
          if (data) {
            this.handleResponse(data);
          }
        });
        setTimeout(() => {
          if (this.exitCode && this.exitCode > 0) {
            reject(new Error(`Generator at ${this.executablePath} could not start:

${this.stderrLogs}`));
          } else {
            resolve();
          }
        }, 200);
      } catch (e) {
        reject(e);
      }
    });
  }
  handleResponse(data) {
    if (data.jsonrpc && data.id) {
      if (typeof data.id !== "number") {
        throw new Error(`message.id has to be a number. Found value ${data.id}`);
      }
      if (this.listeners[data.id]) {
        if (data.error) {
          const error = new GeneratorError(data.error.message, data.error.code, data.error.data);
          this.listeners[data.id](null, error);
        } else {
          this.listeners[data.id](data.result);
        }
        delete this.listeners[data.id];
      }
    }
  }
  registerListener(messageId, cb) {
    this.listeners[messageId] = cb;
  }
  sendMessage(message) {
    this.child.stdin.write(JSON.stringify(message) + "\n");
  }
  getMessageId() {
    return globalMessageId++;
  }
  stop() {
    if (!this.child.killed) {
      this.child.kill();
    }
  }
  getManifest(config) {
    return new Promise((resolve, reject) => {
      const messageId = this.getMessageId();
      this.registerListener(messageId, (result, error) => {
        if (error) {
          return reject(error);
        }
        if (result.manifest) {
          resolve(result.manifest);
        } else {
          resolve(null);
        }
      });
      this.sendMessage({
        jsonrpc: "2.0",
        method: "getManifest",
        params: config,
        id: messageId
      });
    });
  }
  generate(options) {
    return new Promise((resolve, reject) => {
      const messageId = this.getMessageId();
      this.currentGenerateDeferred = { resolve, reject };
      this.registerListener(messageId, (result, error) => {
        if (error) {
          reject(error);
          this.currentGenerateDeferred = void 0;
          return;
        }
        resolve(result);
        this.currentGenerateDeferred = void 0;
      });
      this.sendMessage({
        jsonrpc: "2.0",
        method: "generate",
        params: options,
        id: messageId
      });
    });
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GeneratorError,
  GeneratorProcess
});
