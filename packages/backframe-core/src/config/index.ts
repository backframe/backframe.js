import { resolveCwd } from "@backframe/utils";
import { buildSync } from "esbuild";
import type { Express } from "express";
import fs from "fs";
import { globbySync } from "globby";
import path from "path";
import { BfUserConfig, BF_CONFIG_DEFAULTS } from "./schema.js";
import { loadTsConfig } from "./tsconfig.js";

export type PluginFn = (cfg: BfConfig) => void;
export type PluginKey = "emailProvider" | "storageProvider";

interface IBfServer {
  _app: Express;
}

const BF_OUT_DIR = ".bf";

// TODO: Create Manifest of plugins, provider, etc... that can be used for analysis later
export class BfConfig {
  server!: { _app: Express };
  serverModifiers: PluginFn[];

  compiler: PluginFn;
  emailProvider?: PluginFn;
  storageProvider?: PluginFn;

  constructor(public userCfg: BfUserConfig) {
    this.serverModifiers = [];
    this.compiler = defaultBuilder;
  }

  __compileFiles() {
    this.compiler(this);
  }

  __invokeServerModifiers() {
    this.serverModifiers.forEach((m) => m(this));
  }

  __addServerModifier(m: PluginFn | null) {
    m && this.serverModifiers.push(m);
  }

  __addPlugin(key: PluginKey, p: PluginFn) {
    this[key] = p;
  }

  __invokePlugin(key: PluginKey) {
    this[key]?.(this);
  }

  __updateRootDir(name: string) {
    this.userCfg.root = name;
  }

  __setServer(server: IBfServer) {
    this.server = server;
  }

  getRootDirName() {
    return this.userCfg.root ?? BF_CONFIG_DEFAULTS.root;
  }

  getRoutesDirName() {
    return this.userCfg.routesDir ?? BF_CONFIG_DEFAULTS.routesDir;
  }

  getGqlDirName() {
    return this.userCfg.gqlDir ?? BF_CONFIG_DEFAULTS.gqlDir;
  }

  getEntryPointName() {
    return this.userCfg.entryPoint ?? BF_CONFIG_DEFAULTS.entryPoint;
  }

  getRestConfig() {
    return this.userCfg.interfaces?.rest ?? BF_CONFIG_DEFAULTS.interfaces.rest;
  }

  getGqlConfig() {
    return (
      this.userCfg.interfaces?.graphql ?? BF_CONFIG_DEFAULTS.interfaces.graphql
    );
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
