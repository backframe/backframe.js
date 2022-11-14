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
const { glob } = pkg;

const pkgJson = require(resolveCwd("package.json"));
const format = pkgJson.type === "module" ? "esm" : "cjs";

export async function loadConfig() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let module: any;
  let userCfg: BfUserConfig;
  const matches = glob.sync("./bf.config.*");

  // TODO: Hash and cache and compare config files
  if (!matches.length) {
    logger.warn("no config file found, using default backframe config");
    userCfg = generateDefaultConfig();
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
  userCfg = Object.assign(generateDefaultConfig(), exported);
  const opts = BfConfigSchema.safeParse(userCfg);
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

  const bfConfig = new BfConfig(userCfg);
  const plugins = bfConfig._userCfg.plugins ?? [];

  if (plugins.length) {
    // console animations?!
    logger.info("loading configured plugins...");
    for (const plugin of plugins) {
      let pkg;
      if (typeof plugin == "string") pkg = plugin;
      else pkg = plugin.resolve;

      // load and execute default export from pkg
      resolvePackage(pkg)(bfConfig);
    }

    bfConfig._invokeListeners("afterLoadConfig");
  } // Step 4 done: Loaded plugins and invoke for current stage

  bfConfig._buildFiles(); // Step 5 done: built typescript files or esm files

  return bfConfig;
}

interface IListeners {
  beforeServerStart?: PluginFn[];
  afterLoadConfig?: PluginFn[];
}

type Event = "beforeServerStart" | "afterLoadConfig";
export type PluginFn = (cfg: BfConfig) => BfConfig | void;
export class BfConfig {
  private fileSrc?: string;
  private server!: IBfServer;
  private _builder!: () => void | undefined;
  private _listeners!: IListeners;

  constructor(public _userCfg: BfUserConfig) {
    this._builder = defaultBuilder(this);
    const events = ["beforeServerStart", "afterLoadConfig"];
    const listeners: IListeners = {};
    events.forEach((e) => (listeners[e as Event] = []));
    this._listeners = listeners;
  }

  set builder(builder: () => void | undefined) {
    this._builder = builder;
  }

  _buildFiles() {
    this._builder();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _setServer(server: any) {
    this.server = server;
  }

  _updateFileSrc(src: string) {
    this.fileSrc = src;
  }

  _invokeListeners(event: Event) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    for (const l of this._listeners[event]!) {
      l(this);
    }
  }

  _includesPlugin(name: string) {
    const plugins = this._userCfg.plugins ?? [];
    return plugins.some((p) => {
      if (typeof p === "object") return p.resolve === name;
      return p === name;
    });
  }

  getFileSource() {
    return this.fileSrc ?? this._userCfg.settings.srcDir;
  }

  getServer() {
    return this.server._app;
  }

  getRestConfig() {
    return this._userCfg.interfaces?.rest;
  }

  getGraphqlConfig() {
    return this._userCfg.interfaces?.graphql;
  }

  getPluginOptions(plugin: string) {
    let config: object = {};
    this._userCfg.plugins?.forEach((p) => {
      if (typeof p === "object" && p.resolve === plugin) {
        config = p.options;
      }
    });
    return config;
  }

  getProviderOptions(provider: string) {
    let config: object = {};
    this._userCfg.providers?.forEach((p) => {
      if (p.provider === provider) config = p.config;
    });
    return config;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addListener(event: Event, cb: () => any) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this._listeners[event]!.push(cb);
  }
}

function defaultBuilder(cfg: BfConfig) {
  return () => {
    const dir = cfg.getFileSource() ?? "src";
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
    cfg._updateFileSrc(".bf");

    if (format === "esm") {
      const newPkg = Object.assign(pkgJson, {
        type: "commonjs",
      });

      fs.writeFileSync(
        resolveCwd(".bf/package.json"),
        JSON.stringify(newPkg, null, 2)
      );
    }
  };
}
