/* eslint-disable @typescript-eslint/ban-types */

import { BfConfig } from "@backframe/core";
import type { DB } from "@backframe/models";
import { loadModule, logger, resolveCwd } from "@backframe/utils";
import {
  Handler,
  IHandlerConfig,
  IHandlers,
  IModuleConfig,
  IRouteConfig,
  Method,
  NspListener,
} from "../lib/types.js";
import { RouteItem } from "../routing/router.js";
import {
  DefaultHandlers,
  ResourceConfig,
  _getStaticHandler,
} from "./handlers.js";

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

  listeners?: NspListener;
  afterAll?: Handler<unknown, {}>;
  beforeAll?: Handler<unknown, {}>;
  secured?: Method[];
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
      const filePath = this.routeItem.isExtended
        ? this.routeItem.filePath
        : resolveCwd(this.#routeItem.filePath);
      const mod = await loadModule(filePath);
      const config: IRouteConfig<T> = Object.assign(
        {
          enabledMethods: DEFAULT_ENABLED,
          securedMethods: DEFAULT_PUBLIC,
        },
        mod.config ?? {}
      );
      this.#model = config.model;
      this.secured = config.securedMethods;
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
    const db = this.#bfConfig.$database as DB;
    const model = (this.#model ?? this.route.replace(/\//g, "")) as string;

    // check for a model
    if (db?.[model]) {
      const defaultH = new DefaultHandlers(this, this.#bfConfig);
      // create custom handler
      type key = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
      return defaultH[method.toUpperCase() as key]();
    } else {
      return _getStaticHandler(method, this.route);
    }
  }

  // This function loads the file mapped to a resource and loads the request handlers along with the middleware and listeners etc...
  #loadHandlers(module: IModuleConfig<unknown>) {
    if (
      !module.default ||
      (module.default && module.default instanceof ResourceConfig)
    ) {
      const h = module.default ?? new ResourceConfig(); // use existing or instantiate

      // find enabled methods
      const methods = module?.config?.enabledMethods || DEFAULT_ENABLED;
      const { handlers, middleware, ...otherNamed } = h.__config();

      methods.forEach((m) => {
        // if no handler, use default one
        if (!handlers[m]) {
          handlers[m] = this.#getHandler(m);
        }
      });

      Object.keys(handlers).forEach((k) => {
        this.#handlers[k as Method] = handlers[k as Method];
      });

      this.#middleware = middleware;
      // these keys have a one-to-one mapping from Resource->Module
      const named = ["listeners", "beforeAll", "afterAll"];
      named.forEach(
        // @ts-expect-error (forfit safety for dynamic code)
        (nmd) => (this[nmd] = otherNamed[nmd] ?? undefined)
      );
    }

    // check for named methods exports
    STD_METHODS.forEach((m) => {
      if (module[m]) {
        this.#handlers[m.toLowerCase() as Method] = module[
          m
        ] as IHandlerConfig<{}>;
      }
    });

    // check for other named exports
    if (!this.middleware) {
      this.#middleware = module.middleware;
    }

    // these keys have a one-to-one mapping from Resource->Module
    const named = ["listeners", "beforeAll", "afterAll"];
    named.forEach((nmd) => {
      // @ts-expect-error (forfit safety for dynamic code)
      if (!this[nmd] && module[nmd]) {
        // @ts-expect-error (forfit safety for dynamic code)
        this[nmd] = module[nmd];
      }
    });
  }
}
