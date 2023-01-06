"use strict";
var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
const path = require("path");
const replaceAll = require("replace-string");
const stripAnsi = require("strip-ansi");
const { platformRegex } = require("./platformRegex");
const pipe = /* @__PURE__ */ __name((...fns) => (x) => fns.reduce((v, f) => f(v), x), "pipe");
function normalizePrismaPaths(str) {
  return str.replace(/prisma\\([\w-]+)\.prisma/g, "prisma/$1.prisma").replace(/prisma\\seed\.ts/g, "prisma/seed.ts").replace(/custom-folder\\seed\.js/g, "custom-folder/seed.js");
}
__name(normalizePrismaPaths, "normalizePrismaPaths");
function normalizeLogs(str) {
  return str.replace(/Started query engine http server on http:\/\/127\.0\.0\.1:\d{1,5}/g, "Started query engine http server on http://127.0.0.1:00000").replace(/Starting a postgresql pool with \d+ connections./g, "Starting a postgresql pool with XX connections.");
}
__name(normalizeLogs, "normalizeLogs");
function normalizeTmpDir(str) {
  return str.replace(/\/tmp\/([a-z0-9]+)\//g, "/tmp/dir/");
}
__name(normalizeTmpDir, "normalizeTmpDir");
function trimErrorPaths(str) {
  const parentDir = path.dirname(path.dirname(path.dirname(__dirname)));
  return replaceAll(str, parentDir, "");
}
__name(trimErrorPaths, "trimErrorPaths");
function normalizeToUnixPaths(str) {
  return replaceAll(str, path.sep, "/");
}
__name(normalizeToUnixPaths, "normalizeToUnixPaths");
function normalizeGithubLinks(str) {
  return str.replace(/https:\/\/github.com\/prisma\/prisma(-client-js)?\/issues\/new\S+/, "TEST_GITHUB_LINK");
}
__name(normalizeGithubLinks, "normalizeGithubLinks");
function normalizeTsClientStackTrace(str) {
  return str.replace(/([/\\]client[/\\]src[/\\]__tests__[/\\].*test.ts)(:\d*:\d*)/, "$1:0:0");
}
__name(normalizeTsClientStackTrace, "normalizeTsClientStackTrace");
function removePlatforms(str) {
  return str.replace(platformRegex, "TEST_PLATFORM");
}
__name(removePlatforms, "removePlatforms");
function normalizeNodeApiLibFilePath(str) {
  return str.replace(/((lib)?query_engine-TEST_PLATFORM.)(.*)(.node)/, "libquery_engine-TEST_PLATFORM.LIBRARY_TYPE.node");
}
__name(normalizeNodeApiLibFilePath, "normalizeNodeApiLibFilePath");
function normalizeBinaryFilePath(str) {
  return str.replace(/query-engine-TEST_PLATFORM\.exe/, "query-engine-TEST_PLATFORM");
}
__name(normalizeBinaryFilePath, "normalizeBinaryFilePath");
function normalizeMigrateTimestamps(str) {
  return str.replace(/\d{14}/g, "20201231000000");
}
__name(normalizeMigrateTimestamps, "normalizeMigrateTimestamps");
function normalizeDbUrl(str) {
  return str.replace(/(localhost|postgres|mysql|mssql|mongodb_migrate|cockroachdb):(\d+)/g, "localhost:$2");
}
__name(normalizeDbUrl, "normalizeDbUrl");
function normalizeRustError(str) {
  return str.replace(/\/rustc\/(.+)\//g, "/rustc/hash/").replace(/(\[.*)(:\d*:\d*)(\])/g, "[/some/rust/path:0:0$3");
}
__name(normalizeRustError, "normalizeRustError");
function normalizeArtificialPanic(str) {
  return str.replace(/(Command failed with exit code 101:) (.+) /g, "$1 prisma-engines-path ");
}
__name(normalizeArtificialPanic, "normalizeArtificialPanic");
function normalizeTime(str) {
  return str.replace(/ \d+ms/g, " XXXms").replace(/ \d+(\.\d+)?s/g, " XXXms");
}
__name(normalizeTime, "normalizeTime");
function prepareSchemaForSnapshot(str) {
  if (!str.includes("tmp/prisma-tests/integration-test"))
    return str;
  const urlRegex = /url\s*=\s*.+/;
  const outputRegex = /output\s*=\s*.+/;
  return str.split("\n").map((line) => {
    const urlMatch = urlRegex.exec(line);
    if (urlMatch) {
      return `${line.slice(0, urlMatch.index)}url = "***"`;
    }
    const outputMatch = outputRegex.exec(line);
    if (outputMatch) {
      return `${line.slice(0, outputMatch.index)}output = "***"`;
    }
    return line;
  }).join("\n");
}
__name(prepareSchemaForSnapshot, "prepareSchemaForSnapshot");
module.exports = {
  test(value) {
    return typeof value === "string" || value instanceof Error;
  },
  serialize(value) {
    const message = typeof value === "string" ? value : value instanceof Error ? value.message : "";
    return pipe(stripAnsi, prepareSchemaForSnapshot, normalizeTmpDir, normalizeTime, normalizeGithubLinks, removePlatforms, normalizeNodeApiLibFilePath, normalizeBinaryFilePath, normalizeTsClientStackTrace, trimErrorPaths, normalizePrismaPaths, normalizeLogs, normalizeToUnixPaths, normalizeDbUrl, normalizeRustError, normalizeMigrateTimestamps, normalizeArtificialPanic)(message);
  }
};
