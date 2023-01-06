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
  credentialsToUri: () => credentialsToUri,
  protocolToConnectorType: () => protocolToConnectorType,
  uriToCredentials: () => uriToCredentials
});
var NodeURL = __toModule(require("url"));
var import_path = __toModule(require("path"));
function credentialsToUri(credentials) {
  const type = databaseTypeToProtocol(credentials.type);
  if (credentials.type === "mongodb") {
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
  if (credentials.type === "sqlite") {
    return credentials.uri;
  }
  return url.toString();
}
function uriToCredentials(connectionString) {
  let uri;
  try {
    uri = new NodeURL.URL(connectionString);
  } catch (e) {
    throw new Error("Invalid data source URL, see https://www.prisma.io/docs/reference/database-reference/connection-urls");
  }
  const type = protocolToConnectorType(uri.protocol);
  const exists = (str) => str && str.length > 0;
  if (type === "mongodb") {
    return {
      type,
      uri: connectionString
    };
  }
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
    }
    if (uri.pathname.startsWith("sqlite:")) {
      database = uri.pathname.slice(7);
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
function databaseTypeToProtocol(databaseType) {
  switch (databaseType) {
    case "postgresql":
      return "postgresql:";
    case "mysql":
      return "mysql:";
    case "mongodb":
      return "mongodb:";
    case "sqlite":
      return "sqlite:";
    case "sqlserver":
      return "sqlserver:";
  }
}
function protocolToConnectorType(protocol) {
  switch (protocol) {
    case "postgresql:":
    case "postgres:":
      return "postgresql";
    case "mongodb:":
      return "mongodb";
    case "mysql:":
      return "mysql";
    case "file:":
    case "sqlite:":
      return "sqlite";
    case "sqlserver:":
    case "jdbc:sqlserver:":
      return "sqlserver";
  }
  throw new Error(`Unknown database type ${protocol}`);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  credentialsToUri,
  protocolToConnectorType,
  uriToCredentials
});
