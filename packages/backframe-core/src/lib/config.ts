/* eslint-disable @typescript-eslint/no-var-requires */
import {
  loadModule,
  logger,
  resolveCwd,
  resolvePackage,
} from "@backframe/utils";
import dotenv from "dotenv";
import { buildSync } from "esbuild";
import fs from "fs";
import pkg from "glob";
import { generateDefaultConfig } from "../utils/index.js";
import { BfConfigSchema, BfUserConfig, IBfServer } from "../utils/types.js";
import { Listener, PluginFn, PluginsConfig } from "./plugins.js";
const { glob } = pkg;

export async function loadConfig() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let module: any;
  let config: BfUserConfig;
  const pkg = require(resolveCwd("package.json"));
  const format = pkg.type === "module" ? "esm" : "cjs";
  const matches = glob.sync("./bf.config.*");

  if (!matches.length) {
    logger.warn("no config file found, using default backframe config");
    config = generateDefaultConfig();
  } else {
    const m = matches[0];
    const shouldCompile = () => {
      return m.includes(".mjs") || m.includes(".ts");
    };

    if (format === "esm" || shouldCompile()) {
      const outdir = "./node_modules/.bf";
      buildSync({
        outdir,
        format: "cjs",
        entryPoints: [m],
      });
      module = await loadModule(resolveCwd(`${outdir}/bf.config.js`));
    } else {
      module = await loadModule(resolveCwd(m));
    }
    logger.info("loaded config successfully");
  }

  const exported = module?.default ?? module;
  config = Object.assign(generateDefaultConfig(), exported);
  const opts = BfConfigSchema.safeParse(config);
  if (!opts.success) {
    logger.error("your config file is not valid");
    process.exit(1);
  } // Step 1 done: user-defined config parsed and validated

  let env = glob.sync(".env*");
  env = env.filter((f) => f !== ".env.example");
  if (env.length) {
    dotenv.config({
      path: env[0],
    });
    logger.info(`loaded env variables from \`${env[0]}\``);
  } // Step 2 done: loaded env vars for use in later stages

  const expanded = new BfConfig(config);
  const plugins = expanded._cfg.plugins ?? [];

  if (plugins.length) {
    // console animations?!
    logger.info("loading configured plugins...");
    for (const plugin of plugins) {
      let pkg;
      if (typeof plugin == "string") pkg = plugin;
      else pkg = plugin.resolve;
      const module = resolvePackage(pkg);

      Object.keys(module.listeners).forEach((m) => {
        expanded._registerPlugins(m as Listener, module.listeners[m]);
      });
    }

    expanded._invokePlugins("afterLoadConfig");
  } // Step 4 done: Loaded plugins and invoke for current stage

  if (expanded._hasPlugins("overrideBuilder")) {
    expanded._invokePlugins("overrideBuilder");
  } else {
    const dir = config.settings.srcDir ?? "src";
    const files = glob.sync(`./${dir}/**/*.ts`);
    const shouldBuild = () => {
      return format === "esm" || files.length;
    };

    if (shouldBuild()) {
      buildSync({
        format: "cjs",
        outdir: ".bf",
        entryPoints: [...glob.sync(`./${dir}/**/*.{ts,js}`)],
      });
    }
    expanded._updateFileSrc(".bf");

    if (format === "esm") {
      const newPkg = Object.assign(pkg, {
        type: "commonjs",
      });

      fs.writeFileSync(
        resolveCwd(".bf/package.json"),
        JSON.stringify(newPkg, null, 2)
      );
    }
  } // Step 5 done: built typescript files or esm files

  return expanded;
}

// TODO: rename to bfcfg
export class BfConfig {
  private plugins: PluginsConfig;
  private fileSrc?: string;
  private server!: IBfServer;

  constructor(public _cfg: BfUserConfig) {
    this.plugins = new PluginsConfig({
      afterLoadConfig: [],
      authClient: [],
      beforeServerStart: [],
      databaseClient: [],
      overrideBuilder: [],
      storageProvider: [],
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _setServer(server: any) {
    this.server = server;
  }

  _updateFileSrc(src: string) {
    this.fileSrc = src;
  }

  _invokePlugins(key: Listener) {
    this.plugins.invokePlugins(key, this);
  }

  _registerPlugins(key: Listener, fn: PluginFn) {
    this.plugins.registerPlugin(key, fn);
  }

  _hasPlugins(key: Listener) {
    return this.plugins.includesPlugins(key);
  }

  getFileSource() {
    return this.fileSrc ?? this._cfg.settings.srcDir;
  }

  getServer() {
    return this.server._app;
  }

  getRestConfig() {
    return this._cfg.interfaces?.rest;
  }

  getGraphqlConfig() {
    return this._cfg.interfaces?.graphql;
  }

  getPluginOptions(plugin: string) {
    let config: object = {};
    this._cfg.plugins?.forEach((p) => {
      if (typeof p === "object" && p.resolve === plugin) {
        config = p.options;
      }
    });
    return config;
  }

  getProviderOptions(provider: string) {
    let config: object = {};
    this._cfg.providers?.forEach((p) => {
      if (p.provider === provider) config = p.config;
    });
    return config;
  }
}
