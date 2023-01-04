/* eslint-disable indent */
/* eslint-disable @typescript-eslint/ban-types */

import { BfConfig } from "@backframe/core";
import { loadModule, logger, resolveCwd } from "@backframe/utils";
import type { Namespace } from "socket.io";
import { GenericException } from "../lib/errors.js";
import {
  Handler,
  IHandlerConfig,
  IHandlers,
  IModuleConfig,
  IRouteConfig,
  Method,
} from "../lib/types.js";
import { RouteItem } from "../routing/router.js";
import {
  createHandler,
  ResourceModule,
  _getStaticHandler,
} from "./handlers.js";

export const DEFAULT_ENABLED: Method[] = ["get", "post", "put", "delete"];
export const DEFAULT_PUBLIC: Method[] = ["get"];
export const STD_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"];

export class Resource<T> {
  #model?: T;
  #route!: string;
  #item: RouteItem;
  #bfConfig!: BfConfig;
  #middleware?: Handler<{}>[];
  #handlers!: IHandlers;

  listeners?: (nsp: Namespace) => void;
  public?: Method[];
  enabled?: Method[];

  constructor(item: RouteItem, config: BfConfig) {
    this.#route = item.route;
    this.#bfConfig = config;
    this.#item = item;
    this.#handlers = {};
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
        } from file: ${this.#item.filePath}`
      );
      console.error(error);
      process.exit(1);
    }
  }

  #getHandler(method: Method) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = this.#bfConfig.database as any;
    const model = this.#model ?? this.route;

    // check for a model
    if (db?.[model]) {
      // create custom handler
      switch (method) {
        case "get": {
          return createHandler({
            async action(ctx) {
              let data;

              if (Object.keys(ctx.params ?? {}).length) {
                // single item
              } else {
                // collection
                data = await db[model].findMany();
              }

              return ctx.json(data);
            },
          });
        }
        case "post": {
          return createHandler({
            async action(ctx) {
              try {
                const item = await db[model].create({ data: ctx.input });
                return ctx.json(item);
              } catch (error) {
                return ctx.json(
                  new GenericException(400, error.message, ""),
                  400
                );
              }
            },
          });
        }
        default: {
          return _getStaticHandler(method, this.route);
        }
      }
    } else {
      return _getStaticHandler(method, this.route);
    }
  }

  // TODO: Validate file module
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
      this.#middleware = module["middleware"] as Handler<{}>[];
    }

    // check for listeners
    if (module["listeners"]) {
      this.listeners = module["listeners"] as (nsp: Namespace) => void;
    }
  }
}
