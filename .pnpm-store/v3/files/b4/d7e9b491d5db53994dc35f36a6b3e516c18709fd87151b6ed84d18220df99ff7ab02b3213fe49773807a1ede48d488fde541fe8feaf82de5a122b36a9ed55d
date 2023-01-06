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
var GeneratorProcess_exports = {};
__export(GeneratorProcess_exports, {
  GeneratorError: () => GeneratorError,
  GeneratorProcess: () => GeneratorProcess
});
module.exports = __toCommonJS(GeneratorProcess_exports);
var import_debug = __toESM(require("@prisma/debug"));
var import_chalk = __toESM(require("chalk"));
var import_child_process = require("child_process");
var import_cross_spawn = require("cross-spawn");
var import_byline = __toESM(require("./byline"));
const debug = (0, import_debug.default)("prisma:GeneratorProcess");
let globalMessageId = 1;
class GeneratorError extends Error {
  constructor(message, code, data) {
    super(message);
    this.code = code;
    this.data = data;
  }
}
__name(GeneratorError, "GeneratorError");
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
__name(GeneratorProcess, "GeneratorProcess");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GeneratorError,
  GeneratorProcess
});
