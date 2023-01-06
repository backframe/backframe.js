var __defProp = Object.defineProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
__export(exports, {
  maskQuery: () => maskQuery
});
function maskQuery(query) {
  if (!query) {
    return "";
  }
  return query.replace(/".*"/g, '"X"').replace(/[\s:\[]([+-]?([0-9]*[.])?[0-9]+)/g, (substr) => {
    return `${substr[0]}5`;
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  maskQuery
});
