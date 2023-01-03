import {
  Handler,
  IHandlerConfig,
  IHandlers,
  IModuleConfig,
  IRouteConfig,
  Method,
} from "../lib/types.js";
import { RouteItem } from "../routing/router.js";
import { ResourceModule, _getStaticHandler } from "./handlers.js";
/* eslint-disable @typescript-eslint/ban-types */
import { BfConfig } from "@backframe/core";
import { loadModule, logger, resolveCwd } from "@backframe/utils";

export const DEFAULT_ENABLED: Method[] = ["get", "post", "put", "delete"];
export const DEFAULT_PUBLIC: Method[] = ["get"];
export const STD_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"];

export class Resource<T> {
  #model?: T;
  #route!: string;
  #item: RouteItem;
  #bfConfig!: BfConfig;
  // eslint-disable-next-line @typescript-eslint/ban-types
  #middleware?: Handler<{}>[];
  #handlers!: IHandlers;

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
    const h = module.default ?? new ResourceModule();
    // find enabled methods
    const enabled = module?.config?.enabledMethods || DEFAULT_ENABLED;

    enabled.forEach((e) => {
      if (!h.__handlers[e]) {
        h.__handlers[e] = _getStaticHandler(e, this.#route);
      }
    });

    Object.keys(h.__handlers).forEach((k) => {
      this.#handlers[k as Method] = h.__handlers[k as Method];
    });

    this.#middleware = h.__middleware;

    // check for named exports
    STD_METHODS.forEach((m) => {
      if (module[m]) {
        this.#handlers[m.toLowerCase() as Method] = module[
          m
        ] as IHandlerConfig<{}>;
      }
    });
  }
}
