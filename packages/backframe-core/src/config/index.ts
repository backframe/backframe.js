import type { DB } from "@backframe/models";
import { resolveCwd } from "@backframe/utils";
import swc from "@swc/core";
import type { Express, NextFunction, RequestHandler } from "express";
import fs from "fs";
import { globbySync } from "globby";
import { Server } from "http";
import merge from "lodash.merge";
import path from "path";
import { ZodType } from "zod";
import { PluginFunction } from "../plugins/index.js";
import { PluginManifest } from "../plugins/manifest.js";
import { BfUserConfig, BF_CONFIG_DEFAULTS } from "./schema.js";
import { loadTsConfig } from "./tsconfig.js";

// each key corresponds to a prop of the BfConfig class
export type ConfigKey =
  | "emailProvider"
  | "storageProvider"
  | "compiler"
  | "smsProvider"
  | "pushProvider";
export const PLUGINS_LIST: ConfigKey[] = [
  "compiler",
  "emailProvider",
  "storageProvider",
  "smsProvider",
  "pushProvider",
];

export type Listener =
  | "onServerInit"
  | "onConfigInit"
  | "onSocketsInit"
  | "onServerStart"
  | "onServerStop";
export type Listeners = {
  onServerInit: PluginFunction[];
  onConfigInit: PluginFunction[];
  onSocketsInit: PluginFunction[];
  onServerStart: PluginFunction[];
  onServerStop: PluginFunction[];
};
export const LISTENERS_LIST: Listener[] = [
  "onServerInit",
  "onConfigInit",
  "onSocketsInit",
  "onServerStart",
  "onServerStop",
];
export type DirKey =
  | "viewsDir"
  | "staticDirs"
  | "routesDir"
  | "root"
  | "entryPoint";

export const BF_OUT_DIR = ".bf";

type Method = "get" | "post" | "put" | "patch" | "delete";
export interface IBfServer<T> {
  $app: Express;
  $handle: Server;
  $database?: T;
  $sockets?: unknown;

  $init: (cfg: BfConfig) => Promise<void>;
  $start: (port?: number) => Promise<void>;
  $extendFrom: (
    path: string,
    cfg?: {
      name?: string;
      prefix?: string;
      ignored?: string[];
      [key: string]: unknown;
    }
  ) => void;
  $listRoutes: () => { route: string; type: string; name: string }[];
  $createValidator: (t: ZodType) => RequestHandler;
  $mountRoute: (
    method: Method,
    route: string,
    handler: RequestHandler | RequestHandler[],
    origin?: string
  ) => void;
}

export interface IAuthDef {
  initializers: RequestHandler[];
  middleware: NextFunction[];
  strategies: () => void;
}

export class BfConfig {
  #updatedRootDir: string;
  #pluginManifest: PluginManifest;

  // server related values
  $app?: Express;
  $server?: IBfServer<DB>;
  $database?: DB;
  $sockets?: unknown;

  // config related values/extensions
  $modifiers: Listeners;
  compiler: PluginFunction;
  smsProvider?: PluginFunction;
  pushProvider?: PluginFunction;
  emailProvider?: PluginFunction;
  storageProvider?: PluginFunction;

  // Third party plugins can mount their own options to the config
  pluginsOptions: Record<string, Record<string, unknown>> = {};

  constructor(private userCfg: BfUserConfig) {
    this.$modifiers = {
      onServerInit: [],
      onConfigInit: [],
      onSocketsInit: [],
      onServerStart: [],
      onServerStop: [],
    };
    this.compiler = defaultBuilder;

    this.userCfg = merge(BF_CONFIG_DEFAULTS, userCfg);
    this.#pluginManifest = new PluginManifest(this);
    this.$initialize();
  }

  $initialize() {
    const plugins = this.getConfig("plugins");
    plugins.forEach((p) => {
      this.#pluginManifest.register(p);
    });

    // if any plugin overrides the compiler
    this.$invokePlugin("compiler");
    this.compiler(this); // invoke compiler(it'll only run if typescript detected)

    // invoke config modifiers
    this.$invokeListeners("onConfigInit");
  }

  $invokeListeners<T extends keyof Listeners>(key: T) {
    this.$modifiers[key].forEach((m) => m(this));
  }

  $addListener<T extends keyof Listeners>(key: T, m: PluginFunction | null) {
    m && this.$modifiers[key].push(m);
  }

  $getListeners<T extends keyof Listeners>(key: T) {
    return this.$modifiers[key];
  }

  $addPlugin(key: ConfigKey, p: PluginFunction) {
    this[key] = p;
  }

  $invokePlugin(key: ConfigKey) {
    this[key]?.(this);
  }

  $getPlugin(key: ConfigKey) {
    return this[key];
  }

  $updateRootDir(name: string) {
    this.#updatedRootDir = name;
  }

  // configure server,app,database,sockets
  $setServer<T extends DB>(server: IBfServer<T>) {
    this.$server = server;
    this.$app = server.$app;
    this.$database = server.$database;
    this.$sockets = server.$sockets;
  }

  /**
   * This method is used to access keys defined in the user config without having to chain values on the
   * `userCfg` property. For example, if you want to access the `root` key in the user config, you can
   * do so by calling `getConfig("root")` instead of `userCfg.root`.
   *
   * @param key - A key of the user config @type{BfUserConfig}
   * @returns @type{BfUserConfig[K]}
   * @example
   * const config = new BfConfig({ root: "src", staticDirs: ["public", "assets"], interfaces: {rest: {}} });
   * config.getConfig("root"); // "src"
   * config.getConfig("staticDirs"); // ["public", "assets"]
   * config.getConfig("interfaces"); // {rest: {}}
   * config.getConfig("interfaces", "rest"); // {}
   */
  getConfig<K extends keyof BfUserConfig>(key: K): BfUserConfig[K] {
    return this.userCfg[key];
  }

  /**
   * @jsdoc
   * This method returns the name of a directory specified in the user config. Note that this method
   * does not return the absolute path of the directory. Instead, it returns the name of the directory
   * as specified in the user config. To get the absolute path of the directory, use `getDirPath`.
   *
   * @param key - A key of the user config that corresponds to a directory @type{DirKey}
   * @returns string | string[]
   * @example
   * const config = new BfConfig({ root: "src", staticDirs: ["public", "assets"] });
   * config.getDirName("root"); // "src"
   * config.getDirName("staticDirs"); // ["public", "assets"]
   */
  getDirName<K extends keyof BfUserConfig & DirKey>(key: K): BfUserConfig[K] {
    if (key === "root" && this.#updatedRootDir)
      return this.#updatedRootDir as BfUserConfig[K];
    return this.userCfg[key];
  }

  /**
   * @jsdoc
   * This method returns the absolute path of a directory specified in the user config. It takes a key
   * of the user config that corresponds to a directory @type{DirKey} and returns the absolute path of
   * the directory.
   *
   * @param key - A key of the user config that corresponds to a directory @type{DirKey}
   * @returns string | string[]
   * @example
   * const config = new BfConfig({ root: "src", staticDirs: ["public", "assets"] });
   * config.getDirPath("root"); // "/path/to/project/src"
   * config.getDirPath("staticDirs"); // ["/path/to/project/src/public", "/path/to/project/src/assets"]
   */
  getDirPath<K extends keyof BfUserConfig & DirKey>(key: K): BfUserConfig[K] {
    const root = this.getDirName("root");
    const dirName = this.getDirName(key);

    if (Array.isArray(dirName)) {
      return dirName.map((d) => path.join(root, d)) as BfUserConfig[K];
    }
    return path.join(root, dirName).replace(/\/\//g, "/") as BfUserConfig[K];
  }

  /**
   * @jsdoc
   * This method simply normalizes the path passed to. This is useful when the end user is using typesript since the files will be compiled to the `.bf` directory. This method will return the path to the file in the `.bf` directory if it exists, otherwise it will return the path to the file in the `root` directory.
   * @param path - The path to the file
   * @returns string
   * @example
   * const config = new BfConfig({ root: "src" });
   * config.normalizePath("src/index.ts"); // "/path/to/project/.bf/src/index.js"
   * config.normalizePath("src/index.js"); // "/path/to/project/src/index.js"
   */
  getAbsDirPath<K extends keyof BfUserConfig & DirKey>(
    key: K
  ): BfUserConfig[K] {
    const root = this.#updatedRootDir ?? this.getDirName("root");
    const dirName = this.getDirName(key);

    if (Array.isArray(dirName)) {
      return dirName.map((d) => resolveCwd(root, d)) as BfUserConfig[K];
    }
    return resolveCwd(root, dirName) as BfUserConfig[K];
  }

  /**
   * @jsdoc
   * This method returns the user defined config for a specific interface. It takes a key of the user
   * config that corresponds to an interface @type{InterfaceKey} and returns the config for that
   * interface.
   * @param key - A key of the user config that corresponds to an interface @type{InterfaceKey}
   * @returns @type{BfUserConfig["interfaces"][K]}
   * @example
   * const config = new BfConfig({ interfaces: {rest: {}} });
   * config.getInterfaceConfig("rest"); // {}
   * config.getInterfaceConfig("graphql"); // undefined
   */
  getInterfaceConfig<K extends keyof BfUserConfig["interfaces"]>(
    key: K
  ): BfUserConfig["interfaces"][K] {
    return this.userCfg.interfaces[key];
  }

  /**
   * @jsdoc
   * This method received a route and returns the route prefixed with the url prefix for the rest interface. It's a convenience method for accessing the url prefix for the rest interface without having to chain values on the `userCfg` property.
   * @param route - The route to prefix
   * @returns string
   * @example
   * const config = new BfConfig({ interfaces: {rest: {urlPrefix: "/api"}} });
   * config.withRoutePrefix("/users"); // "/api/users"
   * config.withRoutePrefix("/api/users"); // "/api/api/users"
   */
  withRestPrefix(route: string) {
    return path
      .join(this.getInterfaceConfig("rest").urlPrefix, route)
      .replace(/\\/g, "/");
  }
}

const defaultBuilder = (cfg: BfConfig) => {
  const root = cfg.getDirName("root");
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
  files.forEach((f) => {
    // compile files with swc then write to .bf
    const { code } = swc.transformFileSync(resolveCwd(f), {
      jsc: {
        parser: {
          syntax: "typescript",
          tsx: false,
          decorators: true,
          dynamicImport: true,
        },
        target: "es2020",
        transform: {
          legacyDecorator: true,
          decoratorMetadata: true,
        },
        baseUrl: resolveCwd(tsconfig.compilerOptions.baseUrl ?? root),
        paths: tsconfig.compilerOptions.paths,
      },
      module: {
        type: "nodenext",
      },
      swcrc: false,
      configFile: false,
      isModule: true,
    });

    const dest = f.replace(`./${root}`, `./${BF_OUT_DIR}`).replace(/ts$/, "js");
    if (!fs.existsSync(path.dirname(dest))) {
      fs.mkdirSync(path.dirname(dest));
    }
    fs.writeFileSync(dest, code);
  });

  // update root dir name
  cfg.$updateRootDir(BF_OUT_DIR);
};
