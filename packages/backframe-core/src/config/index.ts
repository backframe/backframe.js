import { resolveCwd } from "@backframe/utils";
import { buildSync } from "esbuild";
import type { Express, NextFunction, RequestHandler } from "express";
import fs from "fs";
import { globbySync } from "globby";
import merge from "lodash.merge";
import path from "path";
import { PluginListener } from "../plugins/index.js";
import { PluginManifest } from "../plugins/manifest.js";
import { BfUserConfig, BF_CONFIG_DEFAULTS } from "./schema.js";
import { loadTsConfig } from "./tsconfig.js";

// each key corresponds to a prop of the BfConfig class
export type PluginKey = "emailProvider" | "storageProvider" | "compiler";

export const BF_OUT_DIR = ".bf";

export interface IBfServer<T> {
  _app: Express;
  _database?: T;
}

export interface IAuthDef {
  initializers: RequestHandler[];
  middleware: NextFunction[];
  strategies: () => void;
}

// TODO: Create Manifest of plugins, provider, etc... that can be used for analysis later
export class BfConfig {
  #updatedRootDir: string;
  #pluginManifest: PluginManifest;

  app?: Express;
  server?: IBfServer<unknown>;
  database?: unknown;
  authentication?: IAuthDef;

  serverModifiers: PluginListener[];
  configModifiers: PluginListener[];

  compiler: PluginListener;
  emailProvider?: PluginListener;
  storageProvider?: PluginListener;

  __auth?: RequestHandler;
  __authStrategies?: () => void;
  __authMiddleware?: NextFunction;

  constructor(public userCfg: BfUserConfig) {
    this.serverModifiers = [];
    this.configModifiers = [];
    this.compiler = defaultBuilder;

    this.userCfg = merge(BF_CONFIG_DEFAULTS, userCfg);
    this.#pluginManifest = new PluginManifest(this);
  }

  __initialize() {
    const plugins = this.userCfg.plugins;
    plugins.forEach((p) => {
      this.#pluginManifest.register(p);
    });

    // if any plugin overrides the compiler
    this.__invokePlugin("compiler");
    this.compiler(this); // invoke compiler(it'll only run if typescript detected)

    // invoke config modifiers
    this.configModifiers.forEach((m) => m(this));
  }

  __invokeServerModifiers() {
    this.serverModifiers.forEach((m) => m(this));
  }

  __addServerModifier(m: PluginListener | null) {
    m && this.serverModifiers.push(m);
  }

  __addConfigModifier(m: PluginListener | null) {
    m && this.configModifiers.push(m);
  }

  __addPlugin(key: PluginKey, p: PluginListener) {
    this[key] = p;
  }

  __invokePlugin(key: PluginKey) {
    this[key]?.(this);
  }

  __updateRootDir(name: string) {
    this.#updatedRootDir = name;
  }

  __setServer<T>(server: IBfServer<T>) {
    this.server = server;
    this.app = server._app;
    this.database = server._database || {};
  }

  getRootDirName() {
    return this.#updatedRootDir || this.userCfg.root;
  }

  getRoutesDirName() {
    return this.userCfg.routesDir;
  }

  getGqlDirName() {
    return this.userCfg.gqlDir;
  }

  getEntryPointName() {
    return this.userCfg.entryPoint;
  }

  getRestConfig() {
    return this.userCfg.interfaces?.rest;
  }

  getGqlConfig() {
    return this.userCfg.interfaces?.graphql;
  }
}

const defaultBuilder = (cfg: BfConfig) => {
  const root = cfg.getRootDirName();
  const tsconfig = loadTsConfig();

  const globbyWithOpts = (g: string) => {
    return globbySync(g, {
      ignore: [
        ...(tsconfig.exclude ?? []),
        "node_modules/",
        "dist/",
        `${BF_OUT_DIR}/`,
      ],
    });
  };

  // No ts files
  if (!globbyWithOpts(`./${root}/**/*.ts`).length) {
    return;
  }

  if (fs.existsSync(resolveCwd(BF_OUT_DIR))) {
    fs.rmSync(resolveCwd(BF_OUT_DIR), { force: true, recursive: true });
  }

  const files = globbyWithOpts(`./${root}/**/*.{js,ts}`);
  buildSync({
    format: "esm",
    outdir: BF_OUT_DIR,
    entryPoints: files,
  });

  // copy other files over
  let others = globbySync(`./${root}/**/*.*`);
  others = others.filter((o) => ![".js", ".ts"].some((e) => o.includes(e)));

  others.forEach((o) => {
    const file = o.replace(`./${root}`, `./${BF_OUT_DIR}`);
    if (!fs.existsSync(path.dirname(file))) {
      fs.mkdirSync(path.dirname(file));
    }
    fs.copyFileSync(o, file);
  });

  // update root dir name
  cfg.__updateRootDir(BF_OUT_DIR);
};
