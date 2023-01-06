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
  getGenerator: () => getGenerator,
  getGenerators: () => getGenerators,
  knownBinaryTargets: () => knownBinaryTargets,
  skipIndex: () => skipIndex
});
var import_debug = __toModule(require("@prisma/debug"));
var import_engine_core = __toModule(require("@prisma/engine-core"));
var import_engines = __toModule(require("@prisma/engines"));
var import_fetch_engine = __toModule(require("@prisma/fetch-engine"));
var import_get_platform = __toModule(require("@prisma/get-platform"));
var import_chalk = __toModule(require("chalk"));
var import_fs = __toModule(require("fs"));
var import_make_dir = __toModule(require("make-dir"));
var import_p_map = __toModule(require("p-map"));
var import_path = __toModule(require("path"));
var import__ = __toModule(require("."));
var import_Generator = __toModule(require("./Generator"));
var import_getAllVersions = __toModule(require("./getAllVersions"));
var import_pick = __toModule(require("./pick"));
var import_predefinedGeneratorResolvers = __toModule(require("./predefinedGeneratorResolvers"));
var import_resolveOutput = __toModule(require("./resolveOutput"));
var import_extractPreviewFeatures = __toModule(require("./utils/extractPreviewFeatures"));
var import_mapPreviewFeatures = __toModule(require("./utils/mapPreviewFeatures"));
var import_missingDatasource = __toModule(require("./utils/missingDatasource"));
var import_missingGeneratorMessage = __toModule(require("./utils/missingGeneratorMessage"));
var import_mongoFeatureFlagMissingMessage = __toModule(require("./utils/mongoFeatureFlagMissingMessage"));
var import_parseEnvValue = __toModule(require("./utils/parseEnvValue"));
var import_printConfigWarnings = __toModule(require("./utils/printConfigWarnings"));
const debug = (0, import_debug.default)("prisma:getGenerators");
async function getGenerators({
  schemaPath,
  providerAliases: aliases,
  version,
  cliVersion,
  printDownloadProgress,
  baseDir = import_path.default.dirname(schemaPath),
  overrideGenerators,
  skipDownload,
  binaryPathsOverride
}) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
  if (!schemaPath) {
    throw new Error(`schemaPath for getGenerators got invalid value ${schemaPath}`);
  }
  if (!import_fs.default.existsSync(schemaPath)) {
    throw new Error(`${schemaPath} does not exist`);
  }
  const platform = await (0, import_get_platform.getPlatform)();
  const queryEngineBinaryType = (0, import_engines.getCliQueryEngineBinaryType)();
  const queryEngineType = binaryTypeToEngineType(queryEngineBinaryType);
  let prismaPath = binaryPathsOverride == null ? void 0 : binaryPathsOverride[queryEngineType];
  if (version && !prismaPath) {
    const potentialPath = eval(`require('path').join(__dirname, '..')`);
    if (!potentialPath.startsWith("/snapshot/")) {
      const downloadParams = {
        binaries: {
          [queryEngineBinaryType]: potentialPath
        },
        binaryTargets: [platform],
        showProgress: false,
        version,
        skipDownload
      };
      const binaryPathsWithEngineType = await (0, import_fetch_engine.download)(downloadParams);
      prismaPath = binaryPathsWithEngineType[queryEngineBinaryType][platform];
    }
  }
  const datamodel = import_fs.default.readFileSync(schemaPath, "utf-8");
  const config = await (0, import__.getConfig)({
    datamodel,
    datamodelPath: schemaPath,
    prismaPath,
    ignoreEnvVarErrors: true
  });
  if (config.datasources.length === 0) {
    throw new Error(import_missingDatasource.missingDatasource);
  }
  (0, import_printConfigWarnings.printConfigWarnings)(config.warnings);
  const previewFeatures = (0, import_mapPreviewFeatures.mapPreviewFeatures)((0, import_extractPreviewFeatures.extractPreviewFeatures)(config));
  const dmmf = await (0, import__.getDMMF)({
    datamodel,
    datamodelPath: schemaPath,
    prismaPath,
    previewFeatures
  });
  if (dmmf.datamodel.models.length === 0) {
    if (config.datasources.some((d) => d.provider === "mongodb")) {
      throw new Error(import_missingGeneratorMessage.missingModelMessageMongoDB);
    }
    throw new Error(import_missingGeneratorMessage.missingModelMessage);
  }
  if (config.datasources.some((d) => d.provider === "mongodb") && !previewFeatures.includes("mongoDb")) {
    throw new Error(import_mongoFeatureFlagMissingMessage.mongoFeatureFlagMissingMessage);
  }
  const generatorConfigs = overrideGenerators || config.generators;
  await validateGenerators(generatorConfigs);
  const runningGenerators = [];
  try {
    const generators = await (0, import_p_map.default)(generatorConfigs, async (generator, index) => {
      let generatorPath = (0, import_parseEnvValue.parseEnvValue)(generator.provider);
      let paths;
      const providerValue = (0, import_parseEnvValue.parseEnvValue)(generator.provider);
      if (aliases && aliases[providerValue]) {
        generatorPath = aliases[providerValue].generatorPath;
        paths = aliases[providerValue];
      } else if (import_predefinedGeneratorResolvers.predefinedGeneratorResolvers[providerValue]) {
        paths = await import_predefinedGeneratorResolvers.predefinedGeneratorResolvers[providerValue](baseDir, cliVersion);
        generatorPath = paths.generatorPath;
      }
      const generatorInstance = new import_Generator.Generator(generatorPath, generator, paths == null ? void 0 : paths.isNode);
      await generatorInstance.init();
      if (generator.output) {
        generator.output = {
          value: import_path.default.resolve(baseDir, (0, import_parseEnvValue.parseEnvValue)(generator.output)),
          fromEnvVar: null
        };
        generator.isCustomOutput = true;
      } else if (paths) {
        generator.output = {
          value: paths.outputPath,
          fromEnvVar: null
        };
      } else {
        if (!generatorInstance.manifest || !generatorInstance.manifest.defaultOutput) {
          throw new Error(`Can't resolve output dir for generator ${import_chalk.default.bold(generator.name)} with provider ${import_chalk.default.bold(generator.provider)}.
The generator needs to either define the \`defaultOutput\` path in the manifest or you need to define \`output\` in the datamodel.prisma file.`);
        }
        generator.output = {
          value: await (0, import_resolveOutput.resolveOutput)({
            defaultOutput: generatorInstance.manifest.defaultOutput,
            baseDir
          }),
          fromEnvVar: "null"
        };
      }
      const options = {
        datamodel,
        datasources: config.datasources,
        generator,
        dmmf,
        otherGenerators: skipIndex(generatorConfigs, index),
        schemaPath,
        version: version || import_engines.enginesVersion
      };
      generatorInstance.setOptions(options);
      runningGenerators.push(generatorInstance);
      return generatorInstance;
    }, {
      stopOnError: false
    });
    const generatorProviders = generatorConfigs.map((g) => (0, import_parseEnvValue.parseEnvValue)(g.provider));
    for (const g of generators) {
      if (((_a = g == null ? void 0 : g.manifest) == null ? void 0 : _a.requiresGenerators) && ((_b = g == null ? void 0 : g.manifest) == null ? void 0 : _b.requiresGenerators.length) > 0) {
        for (const neededGenerator of (_c = g == null ? void 0 : g.manifest) == null ? void 0 : _c.requiresGenerators) {
          if (!generatorProviders.includes(neededGenerator)) {
            throw new Error(`Generator "${g.manifest.prettyName}" requires generator "${neededGenerator}", but it is missing in your schema.prisma.
Please add it to your schema.prisma:

generator gen {
  provider = "${neededGenerator}"
}
`);
          }
        }
      }
    }
    const neededVersions = Object.create(null);
    for (const g of generators) {
      if (((_d = g.manifest) == null ? void 0 : _d.requiresEngines) && Array.isArray((_e = g.manifest) == null ? void 0 : _e.requiresEngines) && g.manifest.requiresEngines.length > 0) {
        const neededVersion = getEngineVersionForGenerator(g.manifest, version);
        if (!neededVersions[neededVersion]) {
          neededVersions[neededVersion] = { engines: [], binaryTargets: [] };
        }
        for (const engine of (_f = g.manifest) == null ? void 0 : _f.requiresEngines) {
          if (!neededVersions[neededVersion].engines.includes(engine)) {
            neededVersions[neededVersion].engines.push(engine);
          }
        }
        const generatorBinaryTargets = (_h = (_g = g.options) == null ? void 0 : _g.generator) == null ? void 0 : _h.binaryTargets;
        if (generatorBinaryTargets && generatorBinaryTargets.length > 0) {
          const binaryTarget0 = generatorBinaryTargets[0];
          if (binaryTarget0.fromEnvVar !== null) {
            const parsedBinaryTargetsEnvValue = (0, import_parseEnvValue.parseBinaryTargetsEnvValue)(binaryTarget0);
            generatorBinaryTargets.shift();
            if (Array.isArray(parsedBinaryTargetsEnvValue)) {
              for (const platformName of parsedBinaryTargetsEnvValue) {
                generatorBinaryTargets.push({
                  fromEnvVar: binaryTarget0.fromEnvVar,
                  value: platformName
                });
              }
            } else {
              generatorBinaryTargets.push({
                fromEnvVar: binaryTarget0.fromEnvVar,
                value: parsedBinaryTargetsEnvValue
              });
            }
          }
          for (const binaryTarget of generatorBinaryTargets) {
            if (binaryTarget.value === "native") {
              binaryTarget.value = platform;
            }
            if (!neededVersions[neededVersion].binaryTargets.find((object) => object.value === binaryTarget.value)) {
              neededVersions[neededVersion].binaryTargets.push(binaryTarget);
            }
          }
        }
      }
    }
    debug("neededVersions", JSON.stringify(neededVersions, null, 2));
    const binaryPathsByVersion = await getBinaryPathsByVersion({
      neededVersions,
      platform,
      version,
      printDownloadProgress,
      skipDownload,
      binaryPathsOverride
    });
    for (const generator of generators) {
      if (generator.manifest && generator.manifest.requiresEngines) {
        const engineVersion = getEngineVersionForGenerator(generator.manifest, version);
        const binaryPaths = binaryPathsByVersion[engineVersion];
        const generatorBinaryPaths = (0, import_pick.pick)(binaryPaths, generator.manifest.requiresEngines);
        debug({ generatorBinaryPaths });
        generator.setBinaryPaths(generatorBinaryPaths);
        if (engineVersion !== version && generator.options && generator.manifest.requiresEngines.includes(queryEngineType) && generatorBinaryPaths[queryEngineType] && ((_i = generatorBinaryPaths[queryEngineType]) == null ? void 0 : _i[platform])) {
          const customDmmf = await (0, import__.getDMMF)({
            datamodel,
            datamodelPath: schemaPath,
            prismaPath: (_j = generatorBinaryPaths[queryEngineType]) == null ? void 0 : _j[platform],
            previewFeatures
          });
          const options = { ...generator.options, dmmf: customDmmf };
          debug("generator.manifest.prettyName", generator.manifest.prettyName);
          debug("options", options);
          debug("options.generator.binaryTargets", options.generator.binaryTargets);
          generator.setOptions(options);
        }
      }
    }
    return generators;
  } catch (e) {
    runningGenerators.forEach((g) => g.stop());
    throw e;
  }
}
async function getBinaryPathsByVersion({
  neededVersions,
  platform,
  version,
  printDownloadProgress,
  skipDownload,
  binaryPathsOverride
}) {
  const binaryPathsByVersion = Object.create(null);
  for (const currentVersion in neededVersions) {
    binaryPathsByVersion[currentVersion] = {};
    const neededVersion = neededVersions[currentVersion];
    if (neededVersion.binaryTargets.length === 0) {
      neededVersion.binaryTargets = [{ fromEnvVar: null, value: platform }];
    }
    if (process.env.NETLIFY && !neededVersion.binaryTargets.find((object) => object.value === "rhel-openssl-1.0.x")) {
      neededVersion.binaryTargets.push({
        fromEnvVar: null,
        value: "rhel-openssl-1.0.x"
      });
    }
    let binaryTargetBaseDir = eval(`require('path').join(__dirname, '..')`);
    if (version !== currentVersion) {
      binaryTargetBaseDir = import_path.default.join(binaryTargetBaseDir, `./engines/${currentVersion}/`);
      await (0, import_make_dir.default)(binaryTargetBaseDir).catch((e) => console.error(e));
    }
    const binariesConfig = neededVersion.engines.reduce((acc, curr) => {
      if (!(binaryPathsOverride == null ? void 0 : binaryPathsOverride[curr])) {
        acc[engineTypeToBinaryType(curr)] = binaryTargetBaseDir;
      }
      return acc;
    }, Object.create(null));
    if (Object.values(binariesConfig).length > 0) {
      const platforms2 = neededVersion.binaryTargets.map((binaryTarget) => binaryTarget.value);
      const downloadParams = {
        binaries: binariesConfig,
        binaryTargets: platforms2,
        showProgress: typeof printDownloadProgress === "boolean" ? printDownloadProgress : true,
        version: currentVersion && currentVersion !== "latest" ? currentVersion : import_engines.enginesVersion,
        skipDownload
      };
      const binaryPathsWithEngineType = await (0, import_fetch_engine.download)(downloadParams);
      const binaryPaths = mapKeys(binaryPathsWithEngineType, binaryTypeToEngineType);
      binaryPathsByVersion[currentVersion] = binaryPaths;
    }
    if (binaryPathsOverride) {
      const overrideEngines = Object.keys(binaryPathsOverride);
      const enginesCoveredByOverride = neededVersion.engines.filter((engine) => overrideEngines.includes(engine));
      if (enginesCoveredByOverride.length > 0) {
        for (const engine of enginesCoveredByOverride) {
          const enginePath = binaryPathsOverride[engine];
          binaryPathsByVersion[currentVersion][engine] = {
            [platform]: enginePath
          };
        }
      }
    }
  }
  return binaryPathsByVersion;
}
async function getGenerator(options) {
  const generators = await getGenerators(options);
  return generators[0];
}
function skipIndex(arr, index) {
  return [...arr.slice(0, index), ...arr.slice(index + 1)];
}
const knownBinaryTargets = [...import_get_platform.platforms, "native"];
const oldToNewBinaryTargetsMapping = {
  "linux-glibc-libssl1.0.1": "debian-openssl-1.0.x",
  "linux-glibc-libssl1.0.2": "debian-openssl-1.0.x",
  "linux-glibc-libssl1.1.0": "debian-openssl1.1.x"
};
async function validateGenerators(generators) {
  const platform = await (0, import_get_platform.getPlatform)();
  for (const generator of generators) {
    if ((0, import_parseEnvValue.parseEnvValue)(generator.provider) === "photonjs") {
      throw new Error(`Oops! Photon has been renamed to Prisma Client. Please make the following adjustments:
  1. Rename ${import_chalk.default.red('provider = "photonjs"')} to ${import_chalk.default.green('provider = "prisma-client-js"')} in your ${import_chalk.default.bold("schema.prisma")} file.
  2. Replace your ${import_chalk.default.bold("package.json")}'s ${import_chalk.default.red("@prisma/photon")} dependency to ${import_chalk.default.green("@prisma/client")}
  3. Replace ${import_chalk.default.red("import { Photon } from '@prisma/photon'")} with ${import_chalk.default.green("import { PrismaClient } from '@prisma/client'")} in your code.
  4. Run ${import_chalk.default.green("prisma generate")} again.
      `);
    }
    if (generator.config.platforms) {
      throw new Error(`The \`platforms\` field on the generator definition is deprecated. Please rename it to \`binaryTargets\`.`);
    }
    if (generator.config.pinnedBinaryTargets) {
      throw new Error(`The \`pinnedBinaryTargets\` field on the generator definition is deprecated.
Please use the PRISMA_QUERY_ENGINE_BINARY env var instead to pin the binary target.`);
    }
    if (generator.binaryTargets) {
      const binaryTargets = generator.binaryTargets && generator.binaryTargets.length > 0 ? generator.binaryTargets : [{ fromEnvVar: null, value: "native" }];
      const resolvedBinaryTargets = binaryTargets.flatMap((object) => (0, import_parseEnvValue.parseBinaryTargetsEnvValue)(object)).map((p) => p === "native" ? platform : p);
      for (const resolvedBinaryTarget of resolvedBinaryTargets) {
        if (oldToNewBinaryTargetsMapping[resolvedBinaryTarget]) {
          throw new Error(`Binary target ${import_chalk.default.red.bold(resolvedBinaryTarget)} is deprecated. Please use ${import_chalk.default.green.bold(oldToNewBinaryTargetsMapping[resolvedBinaryTarget])} instead.`);
        }
        if (!knownBinaryTargets.includes(resolvedBinaryTarget)) {
          throw new Error(`Unknown binary target ${import_chalk.default.red(resolvedBinaryTarget)} in generator ${import_chalk.default.bold(generator.name)}.
Possible binaryTargets: ${import_chalk.default.greenBright(knownBinaryTargets.join(", "))}`);
        }
      }
      if (!resolvedBinaryTargets.includes(platform)) {
        const originalBinaryTargetsConfig = (0, import_engine_core.getOriginalBinaryTargetsValue)(generator.binaryTargets);
        if (generator) {
          console.log(`${import_chalk.default.yellow("Warning:")} Your current platform \`${import_chalk.default.bold(platform)}\` is not included in your generator's \`binaryTargets\` configuration ${JSON.stringify(originalBinaryTargetsConfig)}.
    To fix it, use this generator config in your ${import_chalk.default.bold("schema.prisma")}:
    ${import_chalk.default.greenBright((0, import_engine_core.printGeneratorConfig)({
            ...generator,
            binaryTargets: (0, import_engine_core.fixBinaryTargets)(generator.binaryTargets, platform)
          }))}
    ${import_chalk.default.gray(`Note, that by providing \`native\`, Prisma Client automatically resolves \`${platform}\`.
    Read more about deploying Prisma Client: ${import_chalk.default.underline("https://github.com/prisma/prisma/blob/main/docs/core/generators/prisma-client-js.md")}`)}
`);
        } else {
          console.log(`${import_chalk.default.yellow("Warning")} The binaryTargets ${JSON.stringify(originalBinaryTargetsConfig)} don't include your local platform ${platform}, which you can also point to with \`native\`.
    In case you want to fix this, you can provide ${import_chalk.default.greenBright(`binaryTargets: ${JSON.stringify(["native", ...binaryTargets || []])}`)} in the schema.prisma file.`);
        }
      }
    }
  }
}
function engineTypeToBinaryType(engineType) {
  if (engineType === "introspectionEngine") {
    return import_fetch_engine.BinaryType.introspectionEngine;
  }
  if (engineType === "migrationEngine") {
    return import_fetch_engine.BinaryType.migrationEngine;
  }
  if (engineType === "queryEngine") {
    return import_fetch_engine.BinaryType.queryEngine;
  }
  if (engineType === "libqueryEngine") {
    return import_fetch_engine.BinaryType.libqueryEngine;
  }
  if (engineType === "prismaFmt") {
    return import_fetch_engine.BinaryType.prismaFmt;
  }
  throw new Error(`Could not convert engine type ${engineType}`);
}
function binaryTypeToEngineType(binaryType) {
  if (binaryType === import_fetch_engine.BinaryType.introspectionEngine) {
    return "introspectionEngine";
  }
  if (binaryType === import_fetch_engine.BinaryType.migrationEngine) {
    return "migrationEngine";
  }
  if (binaryType === import_fetch_engine.BinaryType.libqueryEngine) {
    return "libqueryEngine";
  }
  if (binaryType === import_fetch_engine.BinaryType.queryEngine) {
    return "queryEngine";
  }
  if (binaryType === import_fetch_engine.BinaryType.prismaFmt) {
    return "prismaFmt";
  }
  throw new Error(`Could not convert binary type ${binaryType}`);
}
function mapKeys(obj, mapper) {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    acc[mapper(key)] = value;
    return acc;
  }, {});
}
function getEngineVersionForGenerator(manifest, defaultVersion) {
  let neededVersion = manifest.requiresEngineVersion;
  if ((manifest == null ? void 0 : manifest.version) && import_getAllVersions.engineVersions[manifest == null ? void 0 : manifest.version]) {
    neededVersion = import_getAllVersions.engineVersions[manifest == null ? void 0 : manifest.version];
  }
  neededVersion = neededVersion != null ? neededVersion : defaultVersion;
  return neededVersion != null ? neededVersion : "latest";
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getGenerator,
  getGenerators,
  knownBinaryTargets,
  skipIndex
});
