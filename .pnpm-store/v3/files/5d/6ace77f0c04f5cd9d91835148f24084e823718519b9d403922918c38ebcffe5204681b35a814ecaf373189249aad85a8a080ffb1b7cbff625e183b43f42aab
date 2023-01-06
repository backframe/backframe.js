var __defProp = Object.defineProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
__export(exports, {
  unique: () => unique
});
function unique(arr) {
  const { length } = arr;
  const result = [];
  const seen = new Set();
  loop:
    for (let i = 0; i < length; i++) {
      const value = arr[i];
      if (seen.has(value)) {
        continue loop;
      }
      seen.add(value);
      result.push(value);
    }
  return result;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  unique
});
