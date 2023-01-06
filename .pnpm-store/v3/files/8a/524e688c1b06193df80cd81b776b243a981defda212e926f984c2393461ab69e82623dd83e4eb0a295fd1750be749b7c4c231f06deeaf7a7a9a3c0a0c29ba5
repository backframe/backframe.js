var __defProp = Object.defineProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
__export(exports, {
  mapScalarValues: () => mapScalarValues,
  maskSchema: () => maskSchema
});
function maskSchema(schema) {
  const regex = /url\s*=\s*.+/;
  return schema.split("\n").map((line) => {
    const match = regex.exec(line);
    if (match) {
      return `${line.slice(0, match.index)}url = "***"`;
    }
    return line;
  }).join("\n");
}
function mapScalarValues(obj, mapper) {
  const result = {};
  for (const key in obj) {
    if (typeof obj[key] === "object") {
      result[key] = mapScalarValues(obj[key], mapper);
    } else {
      result[key] = mapper(obj[key]);
    }
  }
  return result;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  mapScalarValues,
  maskSchema
});
