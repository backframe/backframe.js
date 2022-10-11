/* eslint-disable @typescript-eslint/no-var-requires */
import { logger, resolvePackage } from "@backframe/utils";
import dotenv from "dotenv";
import { buildSync } from "esbuild";
import fs from "fs";
import pkg from "glob";
import path from "path";
import { BfConfig, BfConfigSchema, IBfConfigInternal } from "./types.js";
import { generateDefaultConfig } from "./utils.js";
const { glob } = pkg;

const current = (...s: string[]) => path.join(process.cwd(), ...s);
const load = async (s: string) => await import(`${s}`);

export async function loadConfig() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let module: any;
  let config: BfConfig;
  const pkg = require(current("package.json"));
  const format = pkg.type === "module" ? "esm" : "cjs";
  const matches = glob.sync("./bf.config.*");

  if (!matches.length) {
    logger.warn("no config file found, using default backframe config");
    config = generateDefaultConfig();
  } else {
    // check if cfg file is esm
    if (format === "esm" || matches[0].includes(".mjs")) {
      const outdir = "./node_modules/.bf";
      buildSync({
        outdir,
        format: "cjs",
        platform: "node",
        entryPoints: [matches[0]],
      });
      module = await load(current(`${outdir}/bf.config.js`));
    } else {
      module = await load(current(matches[0]));
    }
    logger.info("loaded config successfully");
  }

  config = { ...generateDefaultConfig(), ...(module?.default ?? module) };
  const opts = BfConfigSchema.safeParse(config);
  if (!opts.success) {
    logger.error("your config file is not valid");
    process.exit(1);
  }

  let expanded: IBfConfigInternal = {
    ...config,
    getFileSource: () => "src",
    listeners: {
      _afterLoadConfig: [],
      _beforeServerStart: [],
      _afterServerStart: [],
    },
    pluginsOptions: {},
  };

  // Probe fs
  const src = config.settings.srcDir ?? "src";
  const files = glob.sync(`./${src}/**/*.ts`);
  if (files.length || format === "esm") {
    buildSync({
      format: "cjs",
      outdir: ".bf",
      entryPoints: glob.sync(`./${src}/**/*.{ts,js}`),
      keepNames: true,
    });

    expanded.metadata = {
      ...expanded.metadata,
      ...{ fileSrc: ".bf", typescript: true },
    };

    const pkg = {
      type: "commonjs",
    };
    format === "esm" &&
      fs.writeFileSync(
        current(".bf/package.json"),
        JSON.stringify(pkg, null, 2)
      );
  }

  // 1: Load env
  let env = glob.sync(".env*");
  env = env.filter((f) => f !== ".env.example");
  if (env.length) {
    dotenv.config({
      path: env[0],
    });
    logger.info(`loaded env variables from \`${env[0]}\``);
  }

  // 3: set defaults and so on;
  expanded.getFileSource = () => {
    if (expanded.metadata?.fileSrc) return expanded.metadata.fileSrc;
    return expanded.settings.srcDir;
  };

  // Start reading plugins
  const plugins = expanded.plugins ?? [];
  plugins.length && logger.info("loading configured plugins...");
  for (const plugin of plugins) {
    let pkg;

    if (typeof plugin === "string") pkg = plugin;
    else pkg = plugin.resolve;
    const module = resolvePackage(pkg);

    if (module.afterLoadConfig) {
      expanded = await module.afterLoadConfig(expanded);
    }
    if (module.beforeServerStart) {
      expanded.listeners?._beforeServerStart.push(module.beforeServerStart);
    }
    if (module.afterServerStart) {
      expanded.listeners?._afterServerStart.push(module.afterServerStart);
    }
  }

  // TODO: Expand config: set defaults etc
  // TODO: Traverse plugins and begin invoking them.
  // TODO: Decide how to handle typescript

  return expanded;
}
