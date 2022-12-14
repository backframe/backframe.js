import { BfConfig } from "@backframe/core";
import { loadModule, logger, resolveCwd } from "@backframe/utils";
import { globbySync } from "globby";
import { Handler, IRouteConfig, Method } from "../lib/types.js";
import { Item } from "../routing/index.js";
import { ResourceHandlers, __getHandlers } from "./handlers.js";

export const DEFAULT_ENABLED: Method[] = ["create", "read", "update", "delete"];
export const DEFAULT_PUBLIC: Method[] = ["read"];

export class Resource<T> {
  #model?: T;
  #route!: string;
  #item: Item;
  #public?: Method[];
  #enabled?: Method[];
  #bfConfig!: BfConfig;
  #middleware?: Handler<{}>[];
  #handlers!: ResourceHandlers;

  constructor(item: Item, config: BfConfig) {
    this.#route = item.route;
    this.#bfConfig = config;
    this.#item = item;
  }

  get route() {
    return this.#route;
  }

  get model() {
    return this.#model;
  }

  get middleware() {
    return this.#middleware;
  }

  get handlers() {
    return this.#handlers;
  }

  async loadHandlers() {
    const mod = await loadModule(resolveCwd(this.#item.filePath));
    const config: IRouteConfig<T> = Object.assign(
      {
        enabled: DEFAULT_ENABLED,
        public: DEFAULT_PUBLIC,
      },
      mod.config ?? {}
    );
    this.#model = config.model;
    this.#public = config.public;
    this.#enabled = config.enabled;
    this.#handlers = __getHandlers(mod, this.#route);
    this.#middleware = this.#handlers?.__middleware ?? [];
  }
}

export function loadResources(cfg: BfConfig) {
  const root = cfg.getRootDirName();
  const src = cfg.getRoutesDirName();
  const ptrn = `./${root}/${src}/**/*.js`;

  const matches = globbySync(ptrn);
  if (!matches.length) {
    logger.warn(`no routes detected in the ${src} directory`);
  }
}
