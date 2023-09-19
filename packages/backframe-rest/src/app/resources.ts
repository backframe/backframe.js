/* eslint-disable @typescript-eslint/ban-types */

import { BfConfig } from "@backframe/core";
import { loadModule, logger, resolveCwd } from "@backframe/utils";
import { ZodObject } from "zod";
import { GenericException } from "../lib/errors.js";
import {
  BfHandler,
  BfHandlerConfig,
  IHandlerConfig,
  IHandlers,
  IModuleConfig,
  IRouteConfig,
  Method,
  NspListener,
} from "../lib/types.js";
import { createRequestValidator } from "../lib/utils.js";
import { RouteItem } from "../routing/router.js";
import { Context } from "./context.js";
import { DefaultHandlers, _getStaticHandler, wrapHandler } from "./handlers.js";
import { BfServer } from "./index.js";

export const DEFAULT_ENABLED: Method[] = ["get", "post", "put", "delete"];
export const DEFAULT_PUBLIC: Method[] = ["get"];
export const STD_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"];

export class Resource<T> {
  #model?: T;
  #route!: string;
  #routeItem: RouteItem;
  #bfConfig!: BfConfig;
  #middleware?: BfHandler[];
  #handlers!: IHandlers;

  listeners?: NspListener;
  afterAll?: BfHandler[];
  beforeAll?: BfHandler[];
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

  async mount(server: BfServer) {
    await this.initialize();
    const middleware = server.$middleware.concat(this.middleware ?? []);

    // check for realtime listeners
    if (this.listeners) {
      if (!server.$sockets) {
        logger.warn(
          `listeners found in route: \`${this.route}\` but sockets plugin not enabled`
        );
      } else {
        const nsp = server.$sockets.of(this.route);
        this.listeners(nsp);
      }
    }

    // check for beforeAll middleware
    this.beforeAll?.forEach((m) => {
      middleware.unshift(m);
    });

    for (const [m, cfg] of Object.entries(this.handlers)) {
      const method = m as Method;

      const {
        middleware: mware,
        input,
        output,
        params,
        query,
      } = cfg as BfHandlerConfig;
      let action = cfg.action;
      middleware.push(...(mware ?? []));

      // check if action is provided
      if (!action) {
        action = this.#getHandler(method).action;
      }

      const $ = async <U extends ZodObject<{}>>(ctx: Context<U>) => {
        let returnValue = await action(ctx);

        // check for output validation
        if (
          output &&
          !(
            returnValue instanceof GenericException ||
            returnValue instanceof Error
          )
        ) {
          const result = output.safeParse(returnValue);

          if (result.success) {
            const sanitized = result.data;

            // @ts-expect-error (not in schema, but should be preserved)
            sanitized.headers = returnValue.headers;
            // @ts-expect-error (not in schema, but should be preserved)
            sanitized.statusCode = returnValue.statusCode;

            returnValue = sanitized;
          } else {
            // @ts-expect-error (value exists)
            const errors = result.error.flatten().fieldErrors;
            const field = Object.keys(errors)[0];
            throw new Error(
              `output validation failed for route: \`${
                this.route
              }\` with method: \`${method}\`. Error on field '${field}': ${errors[
                field
              ][0].toLowerCase()}`
            );
          }
        }

        // check for afterAll hooks
        this.afterAll?.forEach((m) => {
          m(ctx);
        });

        return returnValue;
      };

      const handlers = middleware
        .concat($)
        .map((h) => wrapHandler(h, this.#bfConfig));

      // additional validators (should be `unshifted` last... First line of defense)
      if (input)
        handlers.unshift(
          createRequestValidator({
            schema: input,
            source: "body",
            errorTitle: "Invalid request body",
            errorMsgPrefix: "Error on field",
          })
        );
      if (params)
        handlers.unshift(
          createRequestValidator({
            schema: params,
            source: "params",
            errorTitle: "Invalid request params",
            errorMsgPrefix: "Error on param",
          })
        );
      if (query)
        handlers.unshift(
          createRequestValidator({
            schema: query,
            source: "query",
            errorTitle: "Invalid request query params",
            errorMsgPrefix: "Error on query param",
          })
        );

      // mount resource on express app
      server.$app[method](this.route, handlers);
    }
  }

  resolveModel() {
    let model = this.#model as string;

    if (!model) {
      const parts = this.#route.split("/");
      model = parts[1];
    }

    return model;
  }

  #getHandler(method: Method): IHandlerConfig<{}, {}> {
    const db = this.#bfConfig.$database;
    const model = this.resolveModel();

    // check for a model
    if (db?.hasModel(model)) {
      const defaultH = new DefaultHandlers(this, this.#bfConfig);
      // create custom handler
      type key = "GET" | "POST" | "PUT" | "DELETE";
      return defaultH[method.toUpperCase() as key]();
    } else {
      return _getStaticHandler(method, this.route);
    }
  }

  // This function loads the file mapped to a resource and loads the request handlers along with the middleware and listeners etc...
  #loadHandlers(module: IModuleConfig<unknown>) {
    // find enabled methods
    const methods = module?.config?.enabledMethods || DEFAULT_ENABLED;
    methods.forEach((m) => {
      // if no handler, use default one
      if (!module[m]) {
        this.#handlers[m.toLowerCase() as Method] = this.#getHandler(m);
      }
    });

    // check for named methods exports
    STD_METHODS.forEach((m) => {
      if (module[m]) {
        this.#handlers[m.toLowerCase() as Method] = module[
          m
        ] as BfHandlerConfig;
      }
    });

    // check for other named exports
    this.#middleware = module.middleware;

    // these keys have a one-to-one mapping from Resource->Module
    type Named = "listeners" | "beforeAll" | "afterAll";
    const named = ["listeners", "beforeAll", "afterAll"];
    named.forEach((nmd: Named) => {
      if (!this[nmd] && module[nmd]) {
        // @ts-expect-error (forfit safety for dynamic code)
        this[nmd] = module[nmd];
      }
    });
  }
}
