import dotenv from "dotenv";
import { buildSync } from "esbuild";
import fs from "fs";
import pkg from "glob";
import path from "path";
const { glob } = pkg;

import { BfConfig, IBfConfigInternal } from "./interfaces.js";
import { log } from "./utils.js";

const CONFIG_FILE = "bf.config";

export default async function loadConfig() {
  let usesTs = false;
  let routesGlob = "./routes/**/*.js";

  const cfgFile = glob.sync(`./${CONFIG_FILE}.*`);
  if (!cfgFile.length) {
    log.panic(
      `A ${CONFIG_FILE} file could not be detected in your current dir. Please make sure you have configured your project correctly and are in the root dir.`
    );
  }

  //   Load env
  let env = glob.sync(".env*");
  env = env.filter((f) => f !== ".env.example");
  if (env.length) {
    dotenv.config({
      path: env[0],
    });
    log.info(`Loaded env variables from ${env[0]}`);
  }

  let filePath = `file://${path.join(process.cwd(), `${CONFIG_FILE}.js`)}`;
  //   Transpile files
  if (cfgFile[0].includes(".ts")) {
    let files = glob.sync("./routes/**/*.ts");
    exists("server.ts") && files.push("server.ts");
    files = files.concat([`./${CONFIG_FILE}.ts`]);
    buildSync({
      entryPoints: files,
      outdir: ".bf",
    });
    //   Switch ctx
    filePath = `file://${path.join(
      process.cwd(),
      "./.bf",
      `${CONFIG_FILE}.js`
    )}`;

    usesTs = true;
    routesGlob = "./.bf/routes/**/*.js";
  }

  const module = await import(filePath);
  const config: Partial<IBfConfigInternal> = module.default;

  if (!config || !Object.keys(config).length) {
    log.panic(
      // eslint-disable-next-line quotes
      'Your configuration file appears to be empty. Follow the guide at "https://backframe.js.org/files/bf-config" to learn about config options.'
    );
  }

  // Start modifying config accordingly
  config.metadata = {
    usesTs,
    routesGlob,
  };
  config.hasPlugins = () =>
    config.plugins ? config.plugins.length > 0 : false;
  config.includesPlugin = (val: string) => {
    let included = false;
    config.plugins?.forEach((p) => {
      if (p.resolve === val) included = true;
    });
    return included;
  };

  return config;
}

function exists(val: string) {
  return fs.existsSync(path.join(process.cwd(), val));
}

export function defineConfig(cfg: Partial<BfConfig>) {
  return cfg;
}

export function definePlugin(cfg: Partial<IBfConfigInternal>) {
  return cfg;
}

export {
  BfConfig,
  BfRequestHandler,
  IBfConfigInternal,
  IHandlerContext,
  IResourceConfig,
  IRouteConfig,
} from "./interfaces.js";
