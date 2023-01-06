var __defProp = Object.defineProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
__export(exports, {
  ErrorArea: () => ErrorArea,
  RustPanic: () => RustPanic
});
class RustPanic extends Error {
  constructor(message, rustStack, request, area, schemaPath, schema, introspectionUrl) {
    super(message);
    this.rustStack = rustStack;
    this.request = request;
    this.area = area;
    this.schemaPath = schemaPath;
    this.schema = schema;
    this.introspectionUrl = introspectionUrl;
  }
}
var ErrorArea;
(function(ErrorArea2) {
  ErrorArea2["LIFT_CLI"] = "LIFT_CLI";
  ErrorArea2["PHOTON_STUDIO"] = "PHOTON_STUDIO";
  ErrorArea2["INTROSPECTION_CLI"] = "INTROSPECTION_CLI";
})(ErrorArea || (ErrorArea = {}));
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ErrorArea,
  RustPanic
});
