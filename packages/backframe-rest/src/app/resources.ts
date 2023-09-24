/* eslint-disable @typescript-eslint/ban-types */

import { BfConfig } from "@backframe/core";
import { loadModule, logger, resolveCwd } from "@backframe/utils";
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
import {
  DefaultHandlers,
  _getStaticHandler,
  createHandler,
  wrapHandler,
} from "./handlers.js";
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
      const filePath = this.routeItem.isExtended
        ? this.routeItem.filePath
        : resolveCwd(this.#routeItem.filePath);
      // TODO: validate module exports
      const mod = await loadModule(filePath);
      const config: IRouteConfig<T> = Object.assign(
        {
          enabledMethods: DEFAULT_ENABLED,
          publicMethods: DEFAULT_PUBLIC,
        },
        mod.config ?? {}
      );
      this.#model = config.model;
      this.public = config.publicMethods;
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
        roles,
        auth: authMiddleware,
        runAuthMiddleware,
      } = cfg as BfHandlerConfig;
      let action = cfg.action;
      middleware.push(...(mware ?? []));

      // check if action is provided
      if (!action) {
        action = this.#getHandler(method).action;
      }

      const { action: $ } = createHandler({
        async action(ctx) {
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

            if (result.success === true) {
              const sanitized = result.data;

              // @ts-expect-error (not in schema, but should be preserved)
              sanitized.headers = returnValue.headers;
              // @ts-expect-error (not in schema, but should be preserved)
              sanitized.statusCode = returnValue.statusCode;

              returnValue = sanitized;
            } else {
              const errors: Record<string, string[]> =
                result.error.flatten().fieldErrors;
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

          // check for 'post' auth middleware
          if (
            ["both", "after"].includes(runAuthMiddleware ?? "before") &&
            authMiddleware
          ) {
            logger.dev("found post auth middleware");
            return await authMiddleware(ctx, {
              data: returnValue,
              status: "after",
              allow: () => returnValue,
              deny: (msg?: string) => {
                return new GenericException(
                  401,
                  "Unauthorized",
                  msg ?? "You are not authorized to access this resource"
                );
              },
            });
          }

          return returnValue;
        },
      });

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

      // check for 'pre' auth middleware
      if (
        ["both", "before"].includes(runAuthMiddleware ?? "before") &&
        authMiddleware
      ) {
        logger.dev("found pre auth middleware");
        const h = createHandler({
          async action(ctx) {
            return await authMiddleware(ctx, {
              data: undefined,
              status: "before",
              allow: () => ctx.next(),
              deny: (msg?: string) =>
                ctx.next(
                  new GenericException(
                    401,
                    "Unauthorized",
                    msg ?? "You are not authorized to access this resource"
                  )
                ),
            });
          },
        });
        handlers.unshift(wrapHandler(h.action, this.#bfConfig));
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const auth: any = this.#bfConfig.pluginsOptions?.["auth"]?.["middleware"];
      const resource = this.resolveModel();

      if (auth && !this.public?.includes(method)) {
        logger.dev(`auth middleware running for ${method} on ${resource}`);
        const h = createHandler({
          async action(ctx) {
            return await auth(ctx, {
              currentActions: [method],
              currentResources: [resource],
              resourceRoles: roles,
            });
          },
        });
        handlers.unshift(wrapHandler(h.action, this.#bfConfig));
      }

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

  #authorize() {
    // TODO: check for auth middleware
    // action: model/resource+method
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
