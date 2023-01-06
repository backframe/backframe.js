"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var responseToError_exports = {};
__export(responseToError_exports, {
  responseToError: () => responseToError
});
module.exports = __toCommonJS(responseToError_exports);
var import_BadRequestError = require("../BadRequestError");
var import_GatewayTimeoutError = require("../GatewayTimeoutError");
var import_NotFoundError = require("../NotFoundError");
var import_SchemaMissingError = require("../SchemaMissingError");
var import_ServerError = require("../ServerError");
var import_UnauthorizedError = require("../UnauthorizedError");
var import_UsageExceededError = require("../UsageExceededError");
async function responseToError(response, clientVersion) {
  var _a, _b, _c, _d, _e;
  if (response.ok)
    return void 0;
  const info = { clientVersion, response };
  if (response.status === 400) {
    let knownError;
    try {
      const body = await response.json();
      knownError = (_b = (_a = body == null ? void 0 : body.EngineNotStarted) == null ? void 0 : _a.reason) == null ? void 0 : _b.KnownEngineStartupError;
    } catch (_) {
    }
    if (knownError) {
      throw new import_BadRequestError.BadRequestError(info, knownError.msg, knownError.error_code);
    }
  }
  if (response.status === 401) {
    throw new import_UnauthorizedError.UnauthorizedError(info);
  }
  if (response.status === 404) {
    try {
      const body = await response.json();
      const isSchemaMissing = ((_c = body == null ? void 0 : body.EngineNotStarted) == null ? void 0 : _c.reason) === "SchemaMissing";
      return isSchemaMissing ? new import_SchemaMissingError.SchemaMissingError(info) : new import_NotFoundError.NotFoundError(info);
    } catch (err) {
      return new import_NotFoundError.NotFoundError(info);
    }
  }
  if (response.status === 429) {
    throw new import_UsageExceededError.UsageExceededError(info);
  }
  if (response.status === 504) {
    throw new import_GatewayTimeoutError.GatewayTimeoutError(info);
  }
  if (response.status >= 500) {
    let body;
    try {
      body = await response.json();
    } catch (err) {
      throw new import_ServerError.ServerError(info);
    }
    if (typeof ((_d = body == null ? void 0 : body.EngineNotStarted) == null ? void 0 : _d.reason) === "string") {
      throw new import_ServerError.ServerError(info, body.EngineNotStarted.reason);
    } else if (typeof ((_e = body == null ? void 0 : body.EngineNotStarted) == null ? void 0 : _e.reason) === "object") {
      const keys = Object.keys(body.EngineNotStarted.reason);
      if (keys.length > 0) {
        const reason = body.EngineNotStarted.reason;
        const content = reason[keys[0]];
        throw new import_ServerError.ServerError(info, keys[0], content.logs);
      }
    }
    throw new import_ServerError.ServerError(info);
  }
  if (response.status >= 400) {
    throw new import_BadRequestError.BadRequestError(info);
  }
  return void 0;
}
__name(responseToError, "responseToError");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  responseToError
});
