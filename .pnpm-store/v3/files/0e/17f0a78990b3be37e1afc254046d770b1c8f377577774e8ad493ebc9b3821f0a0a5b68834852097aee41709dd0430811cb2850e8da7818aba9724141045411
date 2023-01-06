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
var DefaultLibraryLoader_exports = {};
__export(DefaultLibraryLoader_exports, {
  DefaultLibraryLoader: () => DefaultLibraryLoader
});
module.exports = __toCommonJS(DefaultLibraryLoader_exports);
var import_debug = __toESM(require("@prisma/debug"));
var import_engines = require("@prisma/engines");
var import_get_platform = require("@prisma/get-platform");
var import_chalk = __toESM(require("chalk"));
var import_fs = __toESM(require("fs"));
var import_path = __toESM(require("path"));
var import_PrismaClientInitializationError = require("../common/errors/PrismaClientInitializationError");
var import_printGeneratorConfig = require("../common/utils/printGeneratorConfig");
var import_util = require("../common/utils/util");
const debug = (0, import_debug.default)("prisma:client:libraryEngine:loader");
class DefaultLibraryLoader {
  constructor(config) {
    this.libQueryEnginePath = null;
    this.platform = null;
    this.config = config;
  }
  async loadLibrary() {
    if (!this.libQueryEnginePath) {
      this.libQueryEnginePath = await this.getLibQueryEnginePath();
    }
    debug(`loadEngine using ${this.libQueryEnginePath}`);
    try {
      return eval("require")(this.libQueryEnginePath);
    } catch (e) {
      if (import_fs.default.existsSync(this.libQueryEnginePath)) {
        if (this.libQueryEnginePath.endsWith(".node")) {
          throw new import_PrismaClientInitializationError.PrismaClientInitializationError(`Unable to load Node-API Library from ${import_chalk.default.dim(this.libQueryEnginePath)}, Library may be corrupt`, this.config.clientVersion);
        } else {
          throw new import_PrismaClientInitializationError.PrismaClientInitializationError(`Expected an Node-API Library but received ${import_chalk.default.dim(this.libQueryEnginePath)}`, this.config.clientVersion);
        }
      } else {
        throw new import_PrismaClientInitializationError.PrismaClientInitializationError(`Unable to load Node-API Library from ${import_chalk.default.dim(this.libQueryEnginePath)}, It does not exist`, this.config.clientVersion);
      }
    }
  }
  async getLibQueryEnginePath() {
    var _a, _b, _c, _d;
    const libPath = (_a = process.env.PRISMA_QUERY_ENGINE_LIBRARY) != null ? _a : this.config.prismaPath;
    if (libPath && import_fs.default.existsSync(libPath) && libPath.endsWith(".node")) {
      return libPath;
    }
    this.platform = (_b = this.platform) != null ? _b : await (0, import_get_platform.getPlatform)();
    const { enginePath: enginePath2, searchedLocations: searchedLocations2 } = await this.resolveEnginePath();
    if (!import_fs.default.existsSync(enginePath2)) {
      const incorrectPinnedPlatformErrorStr = this.platform ? `
You incorrectly pinned it to ${import_chalk.default.redBright.bold(`${this.platform}`)}
` : "";
      let errorText = `Query engine library for current platform "${import_chalk.default.bold(this.platform)}" could not be found.${incorrectPinnedPlatformErrorStr}
This probably happens, because you built Prisma Client on a different platform.
(Prisma Client looked in "${import_chalk.default.underline(enginePath2)}")

Searched Locations:

${searchedLocations2.map((f) => {
        let msg = `  ${f}`;
        if (process.env.DEBUG === "node-engine-search-locations" && import_fs.default.existsSync(f)) {
          const dir = import_fs.default.readdirSync(f);
          msg += dir.map((d) => `    ${d}`).join("\n");
        }
        return msg;
      }).join("\n" + (process.env.DEBUG === "node-engine-search-locations" ? "\n" : ""))}
`;
      if (this.config.generator) {
        this.platform = (_c = this.platform) != null ? _c : await (0, import_get_platform.getPlatform)();
        if (this.config.generator.binaryTargets.find((object) => object.value === this.platform) || this.config.generator.binaryTargets.find((object) => object.value === "native")) {
          errorText += `
You already added the platform${this.config.generator.binaryTargets.length > 1 ? "s" : ""} ${this.config.generator.binaryTargets.map((t) => `"${import_chalk.default.bold(t.value)}"`).join(", ")} to the "${import_chalk.default.underline("generator")}" block
in the "schema.prisma" file as described in https://pris.ly/d/client-generator,
but something went wrong. That's suboptimal.

Please create an issue at https://github.com/prisma/prisma/issues/new`;
          errorText += ``;
        } else {
          errorText += `

To solve this problem, add the platform "${this.platform}" to the "${import_chalk.default.underline("binaryTargets")}" attribute in the "${import_chalk.default.underline("generator")}" block in the "schema.prisma" file:
${import_chalk.default.greenBright(this.getFixedGenerator())}

Then run "${import_chalk.default.greenBright("prisma generate")}" for your changes to take effect.
Read more about deploying Prisma Client: https://pris.ly/d/client-generator`;
        }
      } else {
        errorText += `

Read more about deploying Prisma Client: https://pris.ly/d/client-generator
`;
      }
      throw new import_PrismaClientInitializationError.PrismaClientInitializationError(errorText, this.config.clientVersion);
    }
    this.platform = (_d = this.platform) != null ? _d : await (0, import_get_platform.getPlatform)();
    return enginePath2;
  }
  async resolveEnginePath() {
    var _a, _b, _c, _d;
    const searchedLocations = [];
    let enginePath;
    if (this.libQueryEnginePath) {
      return { enginePath: this.libQueryEnginePath, searchedLocations };
    }
    this.platform = (_a = this.platform) != null ? _a : await (0, import_get_platform.getPlatform)();
    if (__filename.includes("DefaultLibraryLoader")) {
      enginePath = import_path.default.join((0, import_engines.getEnginesPath)(), (0, import_get_platform.getNodeAPIName)(this.platform, "fs"));
      return { enginePath, searchedLocations };
    }
    const dirname = eval("__dirname");
    const searchLocations = [
      import_path.default.resolve(dirname, "../../../.prisma/client"),
      (_d = (_c = (_b = this.config.generator) == null ? void 0 : _b.output) == null ? void 0 : _c.value) != null ? _d : dirname,
      import_path.default.resolve(dirname, ".."),
      import_path.default.dirname(this.config.datamodelPath),
      this.config.cwd,
      "/tmp/prisma-engines"
    ];
    if (this.config.dirname) {
      searchLocations.push(this.config.dirname);
    }
    for (const location of searchLocations) {
      searchedLocations.push(location);
      debug(`Searching for Query Engine Library in ${location}`);
      enginePath = import_path.default.join(location, (0, import_get_platform.getNodeAPIName)(this.platform, "fs"));
      if (import_fs.default.existsSync(enginePath)) {
        return { enginePath, searchedLocations };
      }
    }
    enginePath = import_path.default.join(__dirname, (0, import_get_platform.getNodeAPIName)(this.platform, "fs"));
    return { enginePath: enginePath != null ? enginePath : "", searchedLocations };
  }
  getFixedGenerator() {
    const fixedGenerator = {
      ...this.config.generator,
      binaryTargets: (0, import_util.fixBinaryTargets)(this.config.generator.binaryTargets, this.platform)
    };
    return (0, import_printGeneratorConfig.printGeneratorConfig)(fixedGenerator);
  }
}
__name(DefaultLibraryLoader, "DefaultLibraryLoader");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DefaultLibraryLoader
});
