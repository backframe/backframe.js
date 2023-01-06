var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};
__export(exports, {
  getPackedPackage: () => getPackedPackage
});
var import_copy = __toModule(require("@timsuchanek/copy"));
var import_execa = __toModule(require("execa"));
var import_fs = __toModule(require("fs"));
var import_make_dir = __toModule(require("make-dir"));
var import_path = __toModule(require("path"));
var import_read_pkg_up = __toModule(require("read-pkg-up"));
var import_resolve = __toModule(require("./utils/resolve"));
var import_rimraf = __toModule(require("rimraf"));
var import_shell_quote = __toModule(require("shell-quote"));
var import_tar = __toModule(require("tar"));
var import_tempy = __toModule(require("tempy"));
var import_util = __toModule(require("util"));
var import_hasYarn = __toModule(require("./utils/hasYarn"));
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getPackedPackage
});
