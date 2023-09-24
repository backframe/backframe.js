/* eslint-disable @typescript-eslint/ban-types */

import { BfConfig } from "@backframe/core";
import { loadModule, logger, resolveCwd } from "@backframe/utils";
import { RequestHandler } from "express";
import { ZodType } from "zod";
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
import { createExpressRequestValidator, validate } from "../lib/utils.js";
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

      this.#loadResource(mod);
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

    for (const [m, cfg] of Object.entries(this.handlers)) {
      const method = m as Method;
      const handlers: RequestHandler[] = [];

      this.#loadPreAuthActions(method, cfg, handlers);
      this.#loadInputActions(method, cfg, handlers);
      this.#loadMiddleware(server, cfg, handlers);
      this.#loadOutputActions(method, cfg, handlers);

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

  #getDefaultHandler(method: Method): IHandlerConfig<{}, {}> {
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

  #loadPreAuthActions(
    method: Method,
    cfg: BfHandlerConfig,
    handlers: RequestHandler[]
  ) {
    const roles = cfg.roles ?? [];
    const resource = this.resolveModel(); // resolves to model/endpoint name
    const isPublic = this.public?.includes(method);
    const globalAuthMiddleware =
      this.#bfConfig.$getAuthPluginOptions("middleware");
    const customAuthMiddleware = cfg.auth;
    const isPreAuthMiddleware = ["beforeAndAfter", "before"].includes(
      cfg.runAuthMiddleware ?? "before"
    ); // default to before

    if (isPublic) return;

    // mount global auth middleware - resolves session/token, sets ctx.auth and checks policies
    if (globalAuthMiddleware) {
      handlers.push(
        wrapHandler(async function (ctx) {
          return await globalAuthMiddleware(ctx, {
            currentActions: [method],
            currentResources: [resource],
            resourceRoles: roles,
          });
        }, this.#bfConfig)
      );
    }

    // mount custom auth middleware - cfg.auth() method - may read to ctx.auth
    if (customAuthMiddleware && isPreAuthMiddleware) {
      const h = wrapHandler(async function (ctx) {
        return await customAuthMiddleware(ctx, {
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
      }, this.#bfConfig);
      handlers.push(h);
    }
  }

  #loadInputActions(
    method: Method,
    cfg: BfHandlerConfig,
    handlers: RequestHandler[]
  ) {
    // load request input validation
    // params -> query -> body
    const hasBodySchema = cfg.input;
    const hasParamsSchema = cfg.params;
    const hasQueryStringSchema = cfg.query;

    if (hasParamsSchema) {
      handlers.push(
        createExpressRequestValidator({
          schema: cfg.params,
          source: "params",
          errorTitle: "Invalid request params",
          errorMsgPrefix: "Error on param",
        })
      );
    }

    if (hasQueryStringSchema) {
      handlers.push(
        createExpressRequestValidator({
          schema: cfg.query,
          source: "query",
          errorTitle: "Invalid request query params",
          errorMsgPrefix: "Error on query param",
        })
      );
    }

    if (hasBodySchema) {
      handlers.push(
        createExpressRequestValidator({
          schema: cfg.input,
          source: "body",
          errorTitle: "Invalid request body",
          errorMsgPrefix: "Error on field",
        })
      );
    }
  }

  #loadMiddleware(
    server: BfServer,
    cfg: BfHandlerConfig,
    handlers: RequestHandler[]
  ) {
    const serverMiddleware = server.$middleware;
    const resourceMiddleware = this.middleware;
    const methodMiddleware = cfg.middleware;

    // load middleware
    const middleware = [
      ...(serverMiddleware ?? []),
      ...(resourceMiddleware ?? []),
      ...(methodMiddleware ?? []),
    ];

    // mount middleware
    handlers.push(...middleware.map((m) => wrapHandler(m, this.#bfConfig)));
  }

  #loadOutputActions(
    method: Method,
    cfg: BfHandlerConfig,
    handlers: RequestHandler[]
  ) {
    // load action
    const hasOutputSchema = cfg.output;
    const postAuth = this.#loadPostAuthActions.bind(this);
    const action = cfg.action ?? this.#getDefaultHandler(method).action;

    const h = wrapHandler(async function (ctx) {
      let returnValue = await action(ctx);

      // check for output validation
      if (hasOutputSchema) {
        const data = validate({
          schema: cfg.output,
          input: returnValue,
          onValidationError(error) {
            const errors = error.flatten().fieldErrors;
            const field = Object.keys(errors)[0];
            throw new Error(
              `output validation failed for route: \`${
                this.route
              }\` with method: \`${method}\`. Error on field '${field}': ${errors[
                field
              ][0].toLowerCase()}`
            );
          },
        });

        // preserve headers and status code from original return value
        returnValue = {
          ...data,
          headers: returnValue.headers,
          statusCode: returnValue.statusCode,
        };
      }

      // check for 'post' auth middleware
      return await postAuth(method, cfg, ctx, returnValue);
    }, this.#bfConfig);

    handlers.push(h);
  }

  async #loadPostAuthActions(
    method: Method,
    cfg: BfHandlerConfig,
    ctx: Context<ZodType<{}>, {}>,
    data: unknown
  ) {
    const resource = this.resolveModel(); // resolves to model/endpoint name
    const isPublic = this.public?.includes(method);
    const evaluatePolicies =
      this.#bfConfig.$getAuthPluginOptions("evaluatePolicies");
    const customAuthMiddleware = cfg.auth;
    const isPostAuthMiddleware = ["beforeAndAfter", "after"].includes(
      cfg.runAuthMiddleware ?? "before"
    ); // default to before

    if (isPublic) return data;

    if (evaluatePolicies) {
      const allowed = await evaluatePolicies(ctx, {
        data,
        roles: ctx.auth.roles,
        attemptedActions: [method],
        attemptedResources: [resource],
        status: "after",
      });

      if (!allowed) {
        return new GenericException(
          401,
          "Unauthorized",
          "You are not authorized to access this resource"
        );
      }
    }

    if (customAuthMiddleware && isPostAuthMiddleware) {
      return await customAuthMiddleware(ctx, {
        data,
        status: "after",
        allow: () => data,
        deny: (msg?: string) =>
          new GenericException(
            401,
            "Unauthorized",
            msg ?? "You are not authorized to access this resource"
          ),
      });
    }

    return data;
  }

  // This function loads the file mapped to a resource and loads the request handlers along with the middleware and listeners etc...
  #loadResource(module: IModuleConfig<unknown>) {
    // find enabled methods
    const methods = module?.config?.enabledMethods || DEFAULT_ENABLED;
    methods.forEach((m) => {
      // if no handler, use default one
      if (!module[m]) {
        this.#handlers[m.toLowerCase() as Method] = this.#getDefaultHandler(m);
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
