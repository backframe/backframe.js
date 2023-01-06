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
  predefinedGeneratorResolvers: () => predefinedGeneratorResolvers
});
var import_debug = __toModule(require("@prisma/debug"));
var import_chalk = __toModule(require("chalk"));
var import_execa = __toModule(require("execa"));
var import_fs = __toModule(require("fs"));
var import_has_yarn = __toModule(require("has-yarn"));
var import_path = __toModule(require("path"));
var import_resolve = __toModule(require("./utils/resolve"));
var import__ = __toModule(require("."));
var import_getCommandWithExecutor = __toModule(require("./getCommandWithExecutor"));
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
      await installPackage(baseDir, `-D prisma@${version != null ? version : "latest"}`);
      await installPackage(baseDir, `@prisma/client@${version != null ? version : "latest"}`);
      prismaClientDir = await findPrismaClientDir(import_path.default.join(".", baseDir));
      if (!prismaClientDir) {
        throw new Error(`Could not resolve @prisma/client despite the installation that we just tried.
Please try to install it by hand with ${import_chalk.default.bold.greenBright("npm install @prisma/client")} and rerun ${import_chalk.default.bold((0, import_getCommandWithExecutor.getCommandWithExecutor)("prisma generate"))} \u{1F64F}.`);
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
async function installPackage(baseDir, pkg) {
  const yarnUsed = (0, import_has_yarn.default)(baseDir) || (0, import_has_yarn.default)(import_path.default.join(baseDir, ".."));
  const cmdName = yarnUsed ? "yarn add" : "npm install";
  await import_execa.default.command(`${cmdName} ${pkg}`, {
    cwd: baseDir,
    stdio: "inherit",
    env: {
      PRISMA_SKIP_POSTINSTALL_GENERATE: "true"
    }
  });
}
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
async function checkTypeScriptVersion() {
  const minVersion = "4.1.0";
  try {
    const typescriptPath = await (0, import_resolve.resolvePkg)("typescript", {
      basedir: process.cwd()
    });
    const typescriptPkg = typescriptPath && import_path.default.join(typescriptPath, "package.json");
    if (typescriptPkg && import_fs.default.existsSync(typescriptPkg)) {
      const pjson = require(typescriptPkg);
      const currentVersion = pjson.version;
      if (semverLt(currentVersion, minVersion)) {
        import__.logger.warn(`Prisma detected that your ${import_chalk.default.bold("TypeScript")} version ${currentVersion} is outdated. If you want to use Prisma Client with TypeScript please update it to version ${import_chalk.default.bold(minVersion)} or ${import_chalk.default.bold("newer")}`);
      }
    }
  } catch (e) {
  }
}
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  predefinedGeneratorResolvers
});
