import { BfConfig } from "@backframe/core";
import { loadModule, logger, resolveCwd } from "@backframe/utils";
import {
  Handler,
  IHandlerConfig,
  IModuleConfig,
  IRouteConfig,
  Method,
} from "../lib/types.js";
import { Item } from "../routing/router.js";
import { ResourceHandlers, _crudToStd, _getStaticHandler } from "./handlers.js";

export const DEFAULT_ENABLED: Method[] = ["create", "read", "update", "delete"];
export const DEFAULT_PUBLIC: Method[] = ["read"];
export const STD_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"];
export type BfMethod = "GET" | "PUT" | "POST" | "PATCH" | "DELETE";
export type ExpressMethods = "get" | "put" | "post" | "patch" | "delete";

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
    this.#handlers = new ResourceHandlers();
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

  async initialize() {
    try {
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

      this.#getHandlers(mod);
    } catch (error) {
      logger.error(
        `an error occurred while trying to load resources at ${this.#route}`
      );
      console.error(error);
      process.exit(1);
    }
  }

  // TODO: Validate file module
  #getHandlers(module: IModuleConfig<unknown>) {
    let h = module.default ?? new ResourceHandlers();
    // find enabled methods
    const enabled = module?.config?.enabled || DEFAULT_ENABLED;

    enabled.forEach((e) => {
      const m = _crudToStd(e);
      if (!h[m]) h[m] = _getStaticHandler(e, this.#route);
    });

    Object.keys(h).forEach((k) => {
      if (STD_METHODS.includes(k)) {
        this.#handlers[k as BfMethod] = h[k as BfMethod];
      }

      if (k === "__middleware") {
        this.#middleware = h[k];
      }
    });

    // check named exports
    STD_METHODS.forEach((m) => {
      if (module[m]) {
        this.#handlers[m as BfMethod] = module[m] as IHandlerConfig<{}>;
      }
    });
  }
}
