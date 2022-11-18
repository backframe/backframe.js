import { BfConfig, Model } from "@backframe/core";
import { logger, resolveCwd } from "@backframe/utils";
import pkg from "glob";
import path from "path";
import { _parseHandlers } from "./handlers.js";
import { BfRequestHandler, IResourceHandlers, IRouteConfig } from "./util.js";
const { glob } = pkg;

export class Resource {
  private bfConfig: BfConfig;
  private _route!: string;
  private _handlers!: IResourceHandlers;
  private _model?: Model;
  private _middleware?: BfRequestHandler[];
  private _mwMap: string[];

  get route() {
    return this._route;
  }

  get handlers() {
    return this._handlers;
  }

  get model() {
    return this._model;
  }

  get middleware() {
    return this._middleware;
  }

  constructor(
    file: string,
    config: { bfConfig: BfConfig; middleware: string[] }
  ) {
    this.bfConfig = config.bfConfig;
    this._mwMap = config.middleware;
    this._middleware = [];

    this.resolveRoute(file);
    this.loadMiddleware(file);
    this.loadHandlers(file);
  }

  private resolveRoute(match: string) {
    let segments: string[] = [];
    const bfConfig = this.bfConfig;
    const urlPrefix = bfConfig.getRestConfig()?.urlPrefix ?? "/";

    let file = match.replace(`./${bfConfig.getFileSource()}/routes`, "");
    file = path.join(urlPrefix, file);

    const name = path.basename(file);
    const parts = name.split(".");
    parts.pop(); // remove ext;

    parts.forEach((p) => {
      segments.push(p.replace("$", ":").replace("index", " "));
    });

    this._route = path
      .join(path.dirname(file), segments.join("/"))
      .replace(/\\/g, "/");
  }

  private loadMiddleware(file: string) {
    const base = path.basename(file).split(".")[0];
    let mw = this._mwMap.filter((v) => v.includes(base));
    if (mw.length > 0) {
      const module = require(resolveCwd(mw[0]));
      Object.keys(module).forEach((fn) => {
        this._middleware?.push(module[fn]);
      });
    }
  }

  private loadHandlers(file: string) {
    const module = require(resolveCwd(file));
    const config: IRouteConfig = Object.assign(
      generateRouteConfig(),
      module.config ?? {}
    );

    this._model = config.model;
    this._middleware!.push(...(config.middleware ?? []));
    this._handlers = _parseHandlers(module, this._route);
  }
}

export function loadResources(bfConfig: BfConfig) {
  // TODO: Duplicate routes found
  // first, traverse dir tree and get route files
  const src = bfConfig.getFileSource();
  let matches = glob.sync(`./${src}/routes/**/*.js`);

  !matches.length && logger.warn("no files detected in the routes directory");
  const middleware = matches.filter((m) => m.includes("_"));
  matches = matches.filter((m) => !m.includes("_"));
  return matches.map((m) => new Resource(m, { bfConfig, middleware }));
}

function generateRouteConfig(): IRouteConfig {
  return {
    enabled: ["create", "read", "update", "delete"],
    public: ["read"],
  };
}
