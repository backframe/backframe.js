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
var DataProxyEngine_exports = {};
__export(DataProxyEngine_exports, {
  DataProxyEngine: () => DataProxyEngine
});
module.exports = __toCommonJS(DataProxyEngine_exports);
var import_events = __toESM(require("events"));
var import_Engine = require("../common/Engine");
var import_prismaGraphQLToJSError = require("../common/errors/utils/prismaGraphQLToJSError");
var import_DataProxyError = require("./errors/DataProxyError");
var import_ForcedRetryError = require("./errors/ForcedRetryError");
var import_InvalidDatasourceError = require("./errors/InvalidDatasourceError");
var import_NotImplementedYetError = require("./errors/NotImplementedYetError");
var import_SchemaMissingError = require("./errors/SchemaMissingError");
var import_responseToError = require("./errors/utils/responseToError");
var import_backOff = require("./utils/backOff");
var import_getClientVersion = require("./utils/getClientVersion");
var import_request = require("./utils/request");
const MAX_RETRIES = 10;
const P = Promise.resolve();
class DataProxyEngine extends import_Engine.Engine {
  constructor(config) {
    var _a, _b, _c, _d;
    super();
    this.config = config;
    this.env = { ...this.config.env, ...process.env };
    this.inlineSchema = (_a = config.inlineSchema) != null ? _a : "";
    this.inlineDatasources = (_b = config.inlineDatasources) != null ? _b : {};
    this.inlineSchemaHash = (_c = config.inlineSchemaHash) != null ? _c : "";
    this.clientVersion = (_d = config.clientVersion) != null ? _d : "unknown";
    this.logEmitter = new import_events.default();
    this.logEmitter.on("error", () => {
    });
    const [host, apiKey] = this.extractHostAndApiKey();
    this.remoteClientVersion = P.then(() => (0, import_getClientVersion.getClientVersion)(this.config));
    this.headers = { Authorization: `Bearer ${apiKey}` };
    this.host = host;
  }
  version() {
    return "unknown";
  }
  async start() {
  }
  async stop() {
  }
  on(event, listener) {
    if (event === "beforeExit") {
      throw new import_NotImplementedYetError.NotImplementedYetError("beforeExit event is not yet supported", {
        clientVersion: this.clientVersion
      });
    } else {
      this.logEmitter.on(event, listener);
    }
  }
  async url(s) {
    return `https://${this.host}/${await this.remoteClientVersion}/${this.inlineSchemaHash}/${s}`;
  }
  async getConfig() {
    return Promise.resolve({
      datasources: [
        {
          activeProvider: this.config.activeProvider
        }
      ]
    });
  }
  getDmmf() {
    throw new import_NotImplementedYetError.NotImplementedYetError("getDmmf is not yet supported", {
      clientVersion: this.clientVersion
    });
  }
  async uploadSchema() {
    const response = await (0, import_request.request)(await this.url("schema"), {
      method: "PUT",
      headers: this.headers,
      body: this.inlineSchema,
      clientVersion: this.clientVersion
    });
    const err = await (0, import_responseToError.responseToError)(response, this.clientVersion);
    if (err) {
      this.logEmitter.emit("warn", { message: `Error while uploading schema: ${err.message}` });
      throw err;
    } else {
      this.logEmitter.emit("info", {
        message: `Schema (re)uploaded (hash: ${this.inlineSchemaHash})`
      });
    }
  }
  request(query, headers, attempt = 0) {
    this.logEmitter.emit("query", { query });
    return this.requestInternal({ query, variables: {} }, headers, attempt);
  }
  async requestBatch(queries, headers, isTransaction = false, attempt = 0) {
    this.logEmitter.emit("query", {
      query: `Batch${isTransaction ? " in transaction" : ""} (${queries.length}):
${queries.join("\n")}`
    });
    const body = {
      batch: queries.map((query) => ({ query, variables: {} })),
      transaction: isTransaction
    };
    const { batchResult } = await this.requestInternal(body, headers, attempt);
    return batchResult;
  }
  async requestInternal(body, headers, attempt) {
    var _a;
    try {
      this.logEmitter.emit("info", {
        message: `Calling ${await this.url("graphql")} (n=${attempt})`
      });
      const response = await (0, import_request.request)(await this.url("graphql"), {
        method: "POST",
        headers: { ...headers, ...this.headers },
        body: JSON.stringify(body),
        clientVersion: this.clientVersion
      });
      const e = await (0, import_responseToError.responseToError)(response, this.clientVersion);
      if (e instanceof import_SchemaMissingError.SchemaMissingError) {
        await this.uploadSchema();
        throw new import_ForcedRetryError.ForcedRetryError({
          clientVersion: this.clientVersion,
          cause: e
        });
      }
      if (e)
        throw e;
      const data = await response.json();
      if (data.errors) {
        if (data.errors.length === 1) {
          throw (0, import_prismaGraphQLToJSError.prismaGraphQLToJSError)(data.errors[0], this.config.clientVersion);
        }
      }
      return data;
    } catch (e) {
      this.logEmitter.emit("error", {
        message: `Error while querying: ${(_a = e.message) != null ? _a : "(unknown)"}`
      });
      if (!(e instanceof import_DataProxyError.DataProxyError))
        throw e;
      if (!e.isRetryable)
        throw e;
      if (attempt >= MAX_RETRIES) {
        if (e instanceof import_ForcedRetryError.ForcedRetryError) {
          throw e.cause;
        } else {
          throw e;
        }
      }
      this.logEmitter.emit("warn", { message: "This request can be retried" });
      const delay = await (0, import_backOff.backOff)(attempt);
      this.logEmitter.emit("warn", { message: `Retrying after ${delay}ms` });
      return this.requestInternal(body, headers, attempt + 1);
    }
  }
  transaction() {
    throw new import_NotImplementedYetError.NotImplementedYetError("Interactive transactions are not yet supported", {
      clientVersion: this.clientVersion
    });
  }
  extractHostAndApiKey() {
    const mainDatasourceName = Object.keys(this.inlineDatasources)[0];
    const mainDatasource = this.inlineDatasources[mainDatasourceName];
    const mainDatasourceURL = mainDatasource == null ? void 0 : mainDatasource.url.value;
    const mainDatasourceEnv = mainDatasource == null ? void 0 : mainDatasource.url.fromEnvVar;
    const loadedEnvURL = this.env[mainDatasourceEnv];
    const dataProxyURL = mainDatasourceURL != null ? mainDatasourceURL : loadedEnvURL;
    let url;
    try {
      url = new URL(dataProxyURL != null ? dataProxyURL : "");
    } catch (e) {
      throw new import_InvalidDatasourceError.InvalidDatasourceError("Could not parse URL of the datasource", {
        clientVersion: this.clientVersion
      });
    }
    const { protocol, host, searchParams } = url;
    if (protocol !== "prisma:") {
      throw new import_InvalidDatasourceError.InvalidDatasourceError("Datasource URL must use prisma:// protocol when --data-proxy is used", {
        clientVersion: this.clientVersion
      });
    }
    const apiKey = searchParams.get("api_key");
    if (apiKey === null || apiKey.length < 1) {
      throw new import_InvalidDatasourceError.InvalidDatasourceError("No valid API key found in the datasource URL", {
        clientVersion: this.clientVersion
      });
    }
    return [host, apiKey];
  }
  metrics(options) {
    throw new import_NotImplementedYetError.NotImplementedYetError("Metric are not yet supported for Data Proxy", {
      clientVersion: this.clientVersion
    });
  }
}
__name(DataProxyEngine, "DataProxyEngine");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DataProxyEngine
});
