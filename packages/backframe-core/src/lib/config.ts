/* eslint-disable @typescript-eslint/ban-types */
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
import path from "path";
import { BfConfigSchema, BfUserConfig, generateDefaultConfig } from "./util.js";
const { glob } = pkg;

type Event = "beforeServerStart" | "afterLoadConfig" | "afterServerStart";
interface IListeners {
  beforeServerStart?: Function[];
  afterLoadConfig?: Function[];
  afterServerStart?: Function[];
}
const pkgJson = require(resolveCwd("package.json"));
const format = pkgJson.type === "module" ? "esm" : "cjs";
const events = ["beforeServerStart", "afterLoadConfig", "afterServerStart"];

export class BfConfig {
  private fileSrc?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private server!: any;
  private _listeners!: IListeners;
  private _builders!: [() => void | undefined];

  constructor(public _userCfg: BfUserConfig) {
    this._builders = [defaultBuilder(this)];
    const listeners: IListeners = {};
    events.forEach((e) => (listeners[e as Event] = []));
    this._listeners = listeners;
  }

  _buildFiles() {
    this._builders.forEach((b) => b());
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

  getInternalApp() {
    return this.server._app;
  }

  getServer() {
    return this.server;
  }

  getSettings() {
    return this._userCfg.settings;
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
    this._userCfg.authentication?.providers?.forEach((p) => {
      if (p.provider === provider) config = p.config;
    });
    return config;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addListener(event: Event, cb: () => any) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this._listeners[event]!.push(cb);
  }

  addBuilder(builder: () => void | undefined) {
    this._builders.push(builder);
  }
}

function defaultBuilder(cfg: BfConfig) {
  return () => {
    if (fs.existsSync(resolveCwd(".bf"))) {
      fs.rmSync(resolveCwd(".bf"), { force: true, recursive: true });
    }
    const dir = cfg.getFileSource() ?? "src";
    const files = glob.sync(`./${dir}/**/*.{ts,js}`);
    const shouldBuild = () => {
      return format === "esm" || files.length;
    };

    if (shouldBuild()) {
      buildSync({
        format: "cjs",
        outdir: ".bf",
        entryPoints: [...files],
      });

      // copy other files over
      let others = glob.sync(`./${dir}/**/*.*`);
      others = others.filter((o) => ![".js", ".ts"].some((e) => o.includes(e)));
      others.forEach((o) => {
        const file = o.replace(`./${dir}`, "./.bf");
        if (!fs.existsSync(path.dirname(file))) {
          fs.mkdirSync(path.dirname(file));
        }
        fs.copyFileSync(o, file);
      });

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
    }
  };
}

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

  userCfg = Object.assign(generateDefaultConfig(), module.default ?? module);
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
