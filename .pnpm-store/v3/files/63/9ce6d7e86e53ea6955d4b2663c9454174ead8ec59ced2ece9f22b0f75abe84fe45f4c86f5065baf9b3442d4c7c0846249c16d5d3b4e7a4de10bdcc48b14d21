var __defProp = Object.defineProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
__export(exports, {
  PrismaClientInitializationError: () => PrismaClientInitializationError
});
class PrismaClientInitializationError extends Error {
  constructor(message, clientVersion, errorCode) {
    super(message);
    this.clientVersion = clientVersion;
    this.errorCode = errorCode;
    Error.captureStackTrace(PrismaClientInitializationError);
  }
  get [Symbol.toStringTag]() {
    return "PrismaClientInitializationError";
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PrismaClientInitializationError
});
