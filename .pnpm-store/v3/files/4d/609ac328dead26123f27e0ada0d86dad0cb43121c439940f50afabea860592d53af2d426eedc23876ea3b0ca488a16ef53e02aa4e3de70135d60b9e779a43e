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
var predefinedGeneratorResolvers_exports = {};
__export(predefinedGeneratorResolvers_exports, {
  predefinedGeneratorResolvers: () => predefinedGeneratorResolvers
});
module.exports = __toCommonJS(predefinedGeneratorResolvers_exports);
var import_debug = __toESM(require("@prisma/debug"));
var import_chalk = __toESM(require("chalk"));
var import_execa = __toESM(require("execa"));
var import_fs = __toESM(require("fs"));
var import_has_yarn = __toESM(require("has-yarn"));
var import_path = __toESM(require("path"));
var import__ = require(".");
var import_getCommandWithExecutor = require("./utils/getCommandWithExecutor");
var import_resolve = require("./utils/resolve");
const debug = (0, import_debug.default)("prisma:generator");
const realPath = import_fs.default.promises.realpath;
async function findPrismaClientDir(baseDir) {
  const resolveOpts = { basedir: baseDir, preserveSymlinks: true };
  const CLIDir = await (0, import_resolve.resolvePkg)("prisma", resolveOpts);
  const clientDir = await (0, import_resolve.resolvePkg)("@prisma/client", resolveOpts);
  const resolvedClientDir = clientDir && await realPath(clientDir);
  debug("prismaCLIDir", CLIDir);
  debug("prismaClientDir", clientDir);
  if (CLIDir === void 0)
    return resolvedClientDir;
  if (clientDir === void 0)
    return resolvedClientDir;
  const relDir = import_path.default.relative(CLIDir, clientDir).split(import_path.default.sep);
  if (relDir[0] !== ".." || relDir[1] === "..")
    return void 0;
  return resolvedClientDir;
}
__name(findPrismaClientDir, "findPrismaClientDir");
const predefinedGeneratorResolvers = {
  photonjs: () => {
    throw new Error(`Oops! Photon has been renamed to Prisma Client. Please make the following adjustments:
  1. Rename ${import_chalk.default.red('provider = "photonjs"')} to ${import_chalk.default.green('provider = "prisma-client-js"')} in your ${import_chalk.default.bold("schema.prisma")} file.
  2. Replace your ${import_chalk.default.bold("package.json")}'s ${import_chalk.default.red("@prisma/photon")} dependency to ${import_chalk.default.green("@prisma/client")}
  3. Replace ${import_chalk.default.red("import { Photon } from '@prisma/photon'")} with ${import_chalk.default.green("import { PrismaClient } from '@prisma/client'")} in your code.
  4. Run ${import_chalk.default.green((0, import_getCommandWithExecutor.getCommandWithExecutor)("prisma generate"))} again.
      `);
  },
  "prisma-client-js": async (baseDir, version) => {
    let prismaClientDir = await findPrismaClientDir(baseDir);
    debug("baseDir", baseDir);
    checkYarnVersion();
    await checkTypeScriptVersion();
    if (!prismaClientDir && !process.env.PRISMA_GENERATE_SKIP_AUTOINSTALL) {
      if (!import_fs.default.existsSync(import_path.default.join(process.cwd(), "package.json")) && !import_fs.default.existsSync(import_path.default.join(process.cwd(), "../package.json"))) {
        const defaultPackageJson = `{
  "name": "my-prisma-project",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \\"Error: no test specified\\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
`;
        import_fs.default.writeFileSync(import_path.default.join(process.cwd(), "package.json"), defaultPackageJson);
        console.info(`\u2714 Created ${import_chalk.default.bold.green("./package.json")}`);
      }
      const prismaCliDir = await (0, import_resolve.resolvePkg)("prisma", { basedir: baseDir });
      if (process.platform === "win32" && isYarnUsed(baseDir)) {
        const hasCli = /* @__PURE__ */ __name((s) => prismaCliDir !== void 0 ? s : "", "hasCli");
        const missingCli = /* @__PURE__ */ __name((s) => prismaCliDir === void 0 ? s : "", "missingCli");
        throw new Error(`Could not resolve ${missingCli(`${import_chalk.default.bold("prisma")} and `)}${import_chalk.default.bold("@prisma/client")} in the current project. Please install ${hasCli("it")}${missingCli("them")} with ${missingCli(`${import_chalk.default.bold.greenBright(`${getAddPackageCommandName(baseDir, "dev")} prisma`)} and `)}${import_chalk.default.bold.greenBright(`${getAddPackageCommandName(baseDir)} @prisma/client`)}, and rerun ${import_chalk.default.bold((0, import_getCommandWithExecutor.getCommandWithExecutor)("prisma generate"))} \u{1F64F}.`);
      }
      if (!prismaCliDir) {
        await installPackage(baseDir, `prisma@${version != null ? version : "latest"}`, "dev");
      }
      await installPackage(baseDir, `@prisma/client@${version != null ? version : "latest"}`);
      prismaClientDir = await findPrismaClientDir(import_path.default.join(".", baseDir));
      if (!prismaClientDir) {
        throw new Error(`Could not resolve @prisma/client despite the installation that we just tried.
Please try to install it by hand with ${import_chalk.default.bold.greenBright(`${getAddPackageCommandName(baseDir)} @prisma/client`)} and rerun ${import_chalk.default.bold((0, import_getCommandWithExecutor.getCommandWithExecutor)("prisma generate"))} \u{1F64F}.`);
      }
      console.info(`
\u2714 Installed the ${import_chalk.default.bold.green("@prisma/client")} and ${import_chalk.default.bold.green("prisma")} packages in your project`);
    }
    if (!prismaClientDir) {
      throw new Error(`Could not resolve @prisma/client.
Please try to install it with ${import_chalk.default.bold.greenBright("npm install @prisma/client")} and rerun ${import_chalk.default.bold((0, import_getCommandWithExecutor.getCommandWithExecutor)("prisma generate"))} \u{1F64F}.`);
    }
    return {
      outputPath: prismaClientDir,
      generatorPath: import_path.default.resolve(prismaClientDir, "generator-build/index.js"),
      isNode: true
    };
  }
};
function isYarnUsed(baseDir) {
  return (0, import_has_yarn.default)(baseDir) || (0, import_has_yarn.default)(import_path.default.join(baseDir, ".."));
}
__name(isYarnUsed, "isYarnUsed");
function getAddPackageCommandName(baseDir, dependencyType) {
  let command = isYarnUsed(baseDir) ? "yarn add" : "npm install";
  if (dependencyType === "dev") {
    command += " -D";
  }
  return command;
}
__name(getAddPackageCommandName, "getAddPackageCommandName");
async function installPackage(baseDir, pkg, dependencyType) {
  const cmdName = getAddPackageCommandName(baseDir, dependencyType);
  await import_execa.default.command(`${cmdName} ${pkg}`, {
    cwd: baseDir,
    stdio: "inherit",
    env: {
      PRISMA_SKIP_POSTINSTALL_GENERATE: "true"
    }
  });
}
__name(installPackage, "installPackage");
function checkYarnVersion() {
  if (process.env.npm_config_user_agent) {
    const match = parseUserAgentString(process.env.npm_config_user_agent);
    if (match) {
      const { agent, major, minor, patch } = match;
      if (agent === "yarn" && major === 1) {
        const currentYarnVersion = `${major}.${minor}.${patch}`;
        const minYarnVersion = "1.19.2";
        if (semverLt(currentYarnVersion, minYarnVersion)) {
          import__.logger.warn(`Your ${import_chalk.default.bold("yarn")} has version ${currentYarnVersion}, which is outdated. Please update it to ${import_chalk.default.bold(minYarnVersion)} or ${import_chalk.default.bold("newer")} in order to use Prisma.`);
        }
      }
    }
  }
}
__name(checkYarnVersion, "checkYarnVersion");
async function checkTypeScriptVersion() {
  const minVersion = "4.1.0";
  try {
    const typescriptPath = await (0, import_resolve.resolvePkg)("typescript", {
      basedir: process.cwd()
    });
    debug("typescriptPath", typescriptPath);
    const typescriptPkg = typescriptPath && import_path.default.join(typescriptPath, "package.json");
    if (typescriptPkg && import_fs.default.existsSync(typescriptPkg)) {
      const pjson = require(typescriptPkg);
      const currentVersion = pjson.version;
      if (semverLt(currentVersion, minVersion)) {
        import__.logger.warn(`Prisma detected that your ${import_chalk.default.bold("TypeScript")} version ${currentVersion} is outdated. If you want to use Prisma Client with TypeScript please update it to version ${import_chalk.default.bold(minVersion)} or ${import_chalk.default.bold("newer")}. ${import_chalk.default.dim(`TypeScript found in: ${import_chalk.default.bold(typescriptPath)}`)}`);
      }
    }
  } catch (e) {
  }
}
__name(checkTypeScriptVersion, "checkTypeScriptVersion");
function semverLt(a, b) {
  const [major1, minor1, patch1] = a.split(".");
  const [major2, minor2, patch2] = b.split(".");
  if (major1 < major2) {
    return true;
  }
  if (major1 > major2) {
    return false;
  }
  if (minor1 < minor2) {
    return true;
  }
  if (minor1 > minor2) {
    return false;
  }
  if (patch1 < patch2) {
    return true;
  }
  if (patch1 > patch2) {
    return false;
  }
  return false;
}
__name(semverLt, "semverLt");
function parseUserAgentString(str) {
  const userAgentRegex = /(\w+)\/(\d+)\.(\d+)\.(\d+)/;
  const match = userAgentRegex.exec(str);
  if (match) {
    const agent = match[1];
    const major = parseInt(match[2]);
    const minor = parseInt(match[3]);
    const patch = parseInt(match[4]);
    return { agent, major, minor, patch };
  }
  return null;
}
__name(parseUserAgentString, "parseUserAgentString");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  predefinedGeneratorResolvers
});
