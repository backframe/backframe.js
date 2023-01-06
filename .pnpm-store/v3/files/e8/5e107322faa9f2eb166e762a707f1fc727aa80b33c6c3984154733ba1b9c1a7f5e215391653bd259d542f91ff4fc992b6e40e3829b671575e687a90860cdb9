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
var request_exports = {};
__export(request_exports, {
  request: () => request
});
module.exports = __toCommonJS(request_exports);
var import_NetworkError = require("../errors/NetworkError");
var import_getJSRuntimeName = require("./getJSRuntimeName");
async function request(url, options) {
  var _a;
  const clientVersion = options.clientVersion;
  const jsRuntimeName = (0, import_getJSRuntimeName.getJSRuntimeName)();
  try {
    if (jsRuntimeName === "browser") {
      return await fetch(url, options);
    } else {
      return await nodeFetch(url, options);
    }
  } catch (e) {
    const message = (_a = e.message) != null ? _a : "Unknown error";
    throw new import_NetworkError.RequestError(message, { clientVersion });
  }
}
__name(request, "request");
function buildHeaders(options) {
  return {
    ...options.headers,
    "Content-Type": "application/json"
  };
}
__name(buildHeaders, "buildHeaders");
function buildOptions(options) {
  return {
    method: options.method,
    headers: buildHeaders(options)
  };
}
__name(buildOptions, "buildOptions");
function buildResponse(incomingData, response) {
  return {
    json: () => JSON.parse(Buffer.concat(incomingData).toString()),
    ok: response.statusCode >= 200 && response.statusCode <= 299,
    status: response.statusCode,
    url: response.url
  };
}
__name(buildResponse, "buildResponse");
async function nodeFetch(url, options = {}) {
  const https = include("https");
  const httpsOptions = buildOptions(options);
  const incomingData = [];
  const { origin } = new URL(url);
  return new Promise((resolve, reject) => {
    var _a;
    const request2 = https.request(url, httpsOptions, (response) => {
      const { statusCode, headers: { location } } = response;
      if (statusCode >= 301 && statusCode <= 399 && location) {
        if (location.startsWith("http") === false) {
          resolve(nodeFetch(`${origin}${location}`, options));
        } else {
          resolve(nodeFetch(location, options));
        }
      }
      response.on("data", (chunk) => incomingData.push(chunk));
      response.on("end", () => resolve(buildResponse(incomingData, response)));
      response.on("error", reject);
    });
    request2.on("error", reject);
    request2.end((_a = options.body) != null ? _a : "");
  });
}
__name(nodeFetch, "nodeFetch");
const include = typeof require !== "undefined" ? require : () => {
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  request
});
