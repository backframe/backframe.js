"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var getPackedPackage_exports = {};
__export(getPackedPackage_exports, {
  getPackedPackage: () => getPackedPackage
});
module.exports = __toCommonJS(getPackedPackage_exports);
var import_copy = __toESM(require("@timsuchanek/copy"));
var import_execa = __toESM(require("execa"));
var import_fs = __toESM(require("fs"));
var import_make_dir = __toESM(require("make-dir"));
var import_path = __toESM(require("path"));
var import_read_pkg_up = __toESM(require("read-pkg-up"));
var import_rimraf = __toESM(require("rimraf"));
var import_shell_quote = require("shell-quote");
var import_tar = __toESM(require("tar"));
var import_tempy = __toESM(require("tempy"));
var import_util = require("util");
var import_hasYarn = require("./utils/hasYarn");
var import_resolve = require("./utils/resolve");
const del = (0, import_util.promisify)(import_rimraf.default);
const readdir = (0, import_util.promisify)(import_fs.default.readdir);
const rename = (0, import_util.promisify)(import_fs.default.rename);
async function getPackedPackage(name, target, packageDir) {
  packageDir = packageDir || await (0, import_resolve.resolvePkg)(name, { basedir: process.cwd() }) || await (0, import_resolve.resolvePkg)(name, { basedir: target });
  if (!packageDir) {
    const pkg = await (0, import_read_pkg_up.default)({
      cwd: target
    });
    if (pkg && pkg.packageJson.name === name) {
      packageDir = import_path.default.dirname(pkg.path);
    }
  }
  if (!packageDir && import_fs.default.existsSync(import_path.default.join(process.cwd(), "package.json"))) {
    packageDir = process.cwd();
  }
  if (!packageDir) {
    throw new Error(`Error in getPackage: Could not resolve package ${name} from ${__dirname}`);
  }
  const tmpDir = import_tempy.default.directory();
  const archivePath = import_path.default.join(tmpDir, `package.tgz`);
  const isYarn = await (0, import_hasYarn.hasYarn)(packageDir);
  const packCmd = isYarn ? ["yarn", "pack", "-f", archivePath] : ["npm", "pack", packageDir];
  const escapedCmd = (0, import_shell_quote.quote)(packCmd);
  await import_execa.default.command(escapedCmd, {
    shell: true,
    cwd: isYarn ? packageDir : tmpDir
  });
  if (!isYarn) {
    const filename = (await readdir(tmpDir))[0];
    await rename(import_path.default.join(tmpDir, filename), archivePath);
  }
  await import_tar.default.extract({
    cwd: tmpDir,
    file: archivePath
  });
  await del(archivePath);
  if (target) {
    await (0, import_make_dir.default)(target);
    await (0, import_copy.default)({
      from: import_path.default.join(tmpDir, "package"),
      to: target,
      recursive: true,
      parallelJobs: 20,
      overwrite: true
    });
    await del(tmpDir);
  }
  return import_path.default.join(tmpDir, "package");
}
__name(getPackedPackage, "getPackedPackage");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getPackedPackage
});
