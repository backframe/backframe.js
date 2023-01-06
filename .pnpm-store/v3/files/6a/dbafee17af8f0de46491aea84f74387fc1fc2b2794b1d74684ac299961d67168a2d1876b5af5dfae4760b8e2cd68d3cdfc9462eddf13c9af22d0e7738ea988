var __defProp = Object.defineProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
__export(exports, {
  flatMap: () => flatMap
});
function flatten(array) {
  return Array.prototype.concat.apply([], array);
}
function flatMap(array, callbackFn, thisArg) {
  return flatten(array.map(callbackFn, thisArg));
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  flatMap
});
