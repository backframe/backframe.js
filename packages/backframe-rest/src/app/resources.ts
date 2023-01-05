/* eslint-disable indent */
/* eslint-disable @typescript-eslint/ban-types */

import { BfConfig } from "@backframe/core";
import type { DB } from "@backframe/models";
import { loadModule, logger, resolveCwd } from "@backframe/utils";
import type { Namespace } from "socket.io";
import {
  Handler,
  IHandlerConfig,
  IHandlers,
  IModuleConfig,
  IRouteConfig,
  Method,
} from "../lib/types.js";
import { RouteItem } from "../routing/router.js";
import { DefaultHandlers, ResourceModule } from "./handlers.js";

export const DEFAULT_ENABLED: Method[] = ["get", "post", "put", "delete"];
export const DEFAULT_PUBLIC: Method[] = ["get"];
export const STD_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"];

export class Resource<T> {
  #model?: T;
  #route!: string;
  #routeItem: RouteItem;
  #bfConfig!: BfConfig;
  #middleware?: Handler<unknown, {}>[];
  #handlers!: IHandlers;

  listeners?: (nsp: Namespace) => void;
  public?: Method[];
  enabled?: Method[];

  constructor(item: RouteItem, config: BfConfig) {
    this.#route = item.route;
    this.#bfConfig = config;
    this.#routeItem = item;
    this.#handlers = {};
  }

  get routeItem() {
    return this.#routeItem;
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
      const mod = await loadModule(resolveCwd(this.#routeItem.filePath));
      const config: IRouteConfig<T> = Object.assign(
        {
          enabledMethods: DEFAULT_ENABLED,
          securedMethods: DEFAULT_PUBLIC,
        },
        mod.config ?? {}
      );
      this.#model = config.model;
      this.public = config.securedMethods;
      this.enabled = config.enabledMethods;

      this.#loadHandlers(mod);
    } catch (error) {
      logger.error(
        `an error occurred while trying to load resources at route: ${
          this.#route
        } from file: ${this.#routeItem.filePath}`
      );
      console.error(error);
      process.exit(1);
    }
  }

  #getHandler(method: Method): IHandlerConfig<{}> {
    const db = this.#bfConfig.database as DB;
    const model = (this.#model ?? this.route) as string;
    const defaultH = new DefaultHandlers(this, this.#bfConfig);

    // check for a model
    if (db?.[model] || db?.[this.#routeItem.dirname]) {
      // create custom handler
      type key = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
      return defaultH[method.toUpperCase() as key]();
    } else {
      return defaultH.STATIC(method, this.route);
    }
  }

  // This function loads the file mapped to a resource and loads the request handlers along with the middleware and listeners etc...
  #loadHandlers(module: IModuleConfig<unknown>) {
    if (
      !module.default ||
      (module.default && module.default instanceof ResourceModule)
    ) {
      const h = module.default ?? new ResourceModule();
      // find enabled methods
      const methods = module?.config?.enabledMethods || DEFAULT_ENABLED;

      methods.forEach((m) => {
        if (!h.__handlers[m]) {
          h.__handlers[m] = this.#getHandler(m);
        }
      });

      Object.keys(h.__handlers).forEach((k) => {
        this.#handlers[k as Method] = h.__handlers[k as Method];
      });

      this.#middleware = h.__middleware;
    }

    // check for named exports
    STD_METHODS.forEach((m) => {
      if (module[m]) {
        this.#handlers[m.toLowerCase() as Method] = module[
          m
        ] as IHandlerConfig<{}>;
      }
    });

    // check for named `middleware` export
    if (module["middleware"]) {
      // TODO: validate middleware values
      this.#middleware = module["middleware"] as Handler<unknown, {}>[];
    }

    // check for listeners
    if (module["listeners"]) {
      this.listeners = module["listeners"] as (nsp: Namespace) => void;
    }
  }
}
