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
var convertCredentials_exports = {};
__export(convertCredentials_exports, {
  credentialsToUri: () => credentialsToUri,
  protocolToConnectorType: () => protocolToConnectorType,
  uriToCredentials: () => uriToCredentials
});
module.exports = __toCommonJS(convertCredentials_exports);
var import_path = __toESM(require("path"));
var NodeURL = __toESM(require("url"));
function credentialsToUri(credentials) {
  const type = databaseTypeToProtocol(credentials.type);
  if (credentials.type === "mongodb") {
    return credentials.uri;
  } else if (credentials.type === "sqlite") {
    return credentials.uri;
  }
  const url = new NodeURL.URL(type + "//");
  if (credentials.host) {
    url.hostname = credentials.host;
  }
  if (credentials.type === "postgresql") {
    if (credentials.database) {
      url.pathname = "/" + credentials.database;
    }
    if (credentials.schema) {
      url.searchParams.set("schema", credentials.schema);
    }
    if (credentials.socket) {
      url.host = credentials.socket;
    }
  } else if (credentials.type === "mysql") {
    url.pathname = "/" + (credentials.database || credentials.schema || "");
    if (credentials.socket) {
      url.searchParams.set("socket", credentials.socket);
    }
  }
  if (credentials.ssl) {
    url.searchParams.set("sslmode", "prefer");
  }
  if (credentials.user) {
    url.username = credentials.user;
  }
  if (credentials.password) {
    url.password = credentials.password;
  }
  if (credentials.port) {
    url.port = String(credentials.port);
  }
  url.host = `${url.hostname}${url.port ? `:${url.port}` : ""}`;
  if (credentials.extraFields) {
    for (const [key, value] of Object.entries(credentials.extraFields)) {
      url.searchParams.set(key, value);
    }
  }
  if (url.pathname === "/") {
    url.pathname = "";
  }
  return url.toString();
}
__name(credentialsToUri, "credentialsToUri");
function uriToCredentials(connectionString) {
  let uri;
  try {
    uri = new NodeURL.URL(connectionString);
  } catch (e) {
    throw new Error("Invalid data source URL, see https://www.prisma.io/docs/reference/database-reference/connection-urls");
  }
  const type = protocolToConnectorType(uri.protocol);
  if (type === "mongodb") {
    return {
      type,
      uri: connectionString
    };
  }
  const exists = /* @__PURE__ */ __name((str) => str && str.length > 0, "exists");
  const extraFields = {};
  const schema = uri.searchParams.get("schema");
  const socket = uri.searchParams.get("socket");
  for (const [name, value] of uri.searchParams) {
    if (!["schema", "socket"].includes(name)) {
      extraFields[name] = value;
    }
  }
  let database = void 0;
  let defaultSchema = void 0;
  if (type === "sqlite" && uri.pathname) {
    if (uri.pathname.startsWith("file:")) {
      database = uri.pathname.slice(5);
    } else {
      database = import_path.default.basename(uri.pathname);
    }
  } else if (uri.pathname.length > 1) {
    database = uri.pathname.slice(1);
    if (type === "postgresql" && !database) {
      database = "postgres";
    }
  }
  if (type === "postgresql" && !schema) {
    defaultSchema = "public";
  }
  return {
    type,
    host: exists(uri.hostname) ? uri.hostname : void 0,
    user: exists(uri.username) ? uri.username : void 0,
    port: exists(uri.port) ? Number(uri.port) : void 0,
    password: exists(uri.password) ? uri.password : void 0,
    database,
    schema: schema || defaultSchema,
    uri: connectionString,
    ssl: Boolean(uri.searchParams.get("sslmode")),
    socket: socket || void 0,
    extraFields
  };
}
__name(uriToCredentials, "uriToCredentials");
function databaseTypeToProtocol(databaseType) {
  switch (databaseType) {
    case "postgresql":
    case "cockroachdb":
      return "postgresql:";
    case "mysql":
      return "mysql:";
    case "mongodb":
      return "mongodb:";
    case "sqlite":
      return "file:";
    case "sqlserver":
      return "sqlserver:";
    case "jdbc:sqlserver":
      return "jdbc:sqlserver:";
  }
  throw new Error(`Unknown databaseType ${databaseType}`);
}
__name(databaseTypeToProtocol, "databaseTypeToProtocol");
function protocolToConnectorType(protocol) {
  switch (protocol) {
    case "postgresql:":
    case "postgres:":
      return "postgresql";
    case "mongodb+srv:":
    case "mongodb:":
      return "mongodb";
    case "mysql:":
      return "mysql";
    case "file:":
      return "sqlite";
    case "sqlserver:":
    case "jdbc:sqlserver:":
      return "sqlserver";
  }
  throw new Error(`Unknown protocol ${protocol}`);
}
__name(protocolToConnectorType, "protocolToConnectorType");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  credentialsToUri,
  protocolToConnectorType,
  uriToCredentials
});
