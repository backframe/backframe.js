var __defProp = Object.defineProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
__export(exports, {
  now: () => now,
  renderDate: () => renderDate,
  timestampToDate: () => timestampToDate
});
const prefixZero = (value) => ("0" + value).slice(-2);
function now() {
  const now2 = new Date();
  return `${now2.getFullYear()}${prefixZero(now2.getMonth() + 1)}${prefixZero(now2.getDate())}${prefixZero(now2.getHours())}${prefixZero(now2.getMinutes())}${prefixZero(now2.getSeconds())}`;
}
function timestampToDate(timestamp) {
  if (!timestamp || timestamp.length !== 14) {
    return void 0;
  }
  const year = Number(timestamp.slice(0, 4));
  const month = Number(timestamp.slice(4, 6));
  const date = Number(timestamp.slice(6, 8));
  const hours = Number(timestamp.slice(8, 10));
  const minutes = Number(timestamp.slice(10, 12));
  const seconds = Number(timestamp.slice(12, 14));
  return new Date(year, month - 1, date, hours, minutes, seconds);
}
function renderDate(date) {
  if (date.getDate() !== new Date().getDate()) {
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  }
  return date.toLocaleTimeString();
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  now,
  renderDate,
  timestampToDate
});
