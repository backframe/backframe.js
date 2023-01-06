"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var now_exports = {};
__export(now_exports, {
  now: () => now,
  renderDate: () => renderDate,
  timestampToDate: () => timestampToDate
});
module.exports = __toCommonJS(now_exports);
const prefixZero = /* @__PURE__ */ __name((value) => ("0" + value).slice(-2), "prefixZero");
function now() {
  const now2 = new Date();
  return `${now2.getFullYear()}${prefixZero(now2.getMonth() + 1)}${prefixZero(now2.getDate())}${prefixZero(now2.getHours())}${prefixZero(now2.getMinutes())}${prefixZero(now2.getSeconds())}`;
}
__name(now, "now");
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
__name(timestampToDate, "timestampToDate");
function renderDate(date) {
  if (date.getDate() !== new Date().getDate()) {
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  }
  return date.toLocaleTimeString();
}
__name(renderDate, "renderDate");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  now,
  renderDate,
  timestampToDate
});
