var __defProp = Object.defineProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
__export(exports, {
  dml: () => dml
});
const dml = {
  string: [/\"(.*)\"/g, /\'(.*)\'/g],
  directive: { pattern: /(@.*)/g },
  entity: [
    /model\s+\w+/g,
    /enum\s+\w+/g,
    /datasource\s+\w+/g,
    /source\s+\w+/g,
    /generator\s+\w+/g
  ],
  comment: /#.*/g,
  value: [/\b\s+(\w+)/g],
  punctuation: /(\:|}|{|"|=)/g,
  boolean: /(true|false)/g
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  dml
});
