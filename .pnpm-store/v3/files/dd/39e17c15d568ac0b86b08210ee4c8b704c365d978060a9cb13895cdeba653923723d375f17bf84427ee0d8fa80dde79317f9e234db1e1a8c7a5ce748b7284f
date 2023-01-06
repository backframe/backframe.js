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
var Connection_exports = {};
__export(Connection_exports, {
  Connection: () => Connection
});
module.exports = __toCommonJS(Connection_exports);
var import_get_stream = __toESM(require("get-stream"));
const undici = /* @__PURE__ */ __name(() => require("undici"), "undici");
function assertHasPool(pool) {
  if (pool === void 0) {
    throw new Error("Connection has not been opened");
  }
}
__name(assertHasPool, "assertHasPool");
class Connection {
  constructor() {
  }
  static async onHttpError(response, handler) {
    const _response = await response;
    if (_response.statusCode >= 400) {
      return handler(_response);
    }
    return _response;
  }
  open(url, options) {
    if (this._pool)
      return;
    this._pool = new (undici()).Pool(url, {
      connections: 1e3,
      keepAliveMaxTimeout: 6e5,
      headersTimeout: 0,
      bodyTimeout: 0,
      ...options
    });
  }
  async raw(method, endpoint, headers, body, parseResponse = true) {
    assertHasPool(this._pool);
    const response = await this._pool.request({
      path: endpoint,
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers
      },
      body
    });
    const bodyString = await (0, import_get_stream.default)(response.body);
    return {
      statusCode: response.statusCode,
      headers: response.headers,
      data: parseResponse ? JSON.parse(bodyString) : bodyString
    };
  }
  post(endpoint, body, headers, parseResponse) {
    return this.raw("POST", endpoint, headers, body, parseResponse);
  }
  get(path, headers) {
    return this.raw("GET", path, headers);
  }
  close() {
    if (this._pool) {
      this._pool.close(() => {
      });
    }
    this._pool = void 0;
  }
}
__name(Connection, "Connection");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Connection
});
