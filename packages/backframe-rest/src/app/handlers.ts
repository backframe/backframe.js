/* eslint-disable @typescript-eslint/ban-types  */

import { BfConfig } from "@backframe/core";
import type { DB, DbEntry } from "@backframe/models";
import { NextFunction, RequestHandler } from "express";
import { ServerResponse } from "http";
import { ZodObject, ZodRawShape } from "zod";
import { GenericException } from "../lib/errors.js";
import {
  BfHandler,
  ExpressReq,
  ExpressRes,
  Handler,
  IHandlerConfig,
  IHandlers,
  Method,
  MethodUpper,
  NspListener,
} from "../lib/types.js";
import { Context } from "./context.js";
import { Resource } from "./resources.js";

export const isRawValue = (v: unknown) => {
  return (
    typeof v === "bigint" ||
    typeof v === "boolean" ||
    typeof v === "number" ||
    typeof v === "string"
  );
};

/**
 * @jsdoc
 * This function is used to define a resource and its handlers, middleware, listeners, etc. It is an alternative to using named constants and exporting them from a module. An advantage of using this function is that it is strongly typed and defines the exact required shape of the resource. When using this function, make sure to export the resource as the default export.
 * @example
 * // define a resource
 * const resource = defineResource()
 *  .handle("GET", {
 *    action: async (ctx) => {
 *      return { hello: "world" };
 *    },
 *  })
 * .handle("POST", {
 *    action: async (ctx) => {
 *      return { hello: "world" };
 *    },
 *  })
 * .middleware(async (ctx) => {
 *    console.log("middleware");
 *    ctx.next();
 * });
 *
 * @returns @type{ResourceConfig}
 */
export function defineResource(): ResourceConfig {
  return new ResourceConfig();
}

/**
 * @jsdoc
 * The `createHandler`` function is used to create a handler. This function is used when defining resource handlers using named exports. It is an alternative to using the `defineResource` function. An advantage of using this function is that it is perhaps easier to use while maintaining type safety. When using this function, make sure to export the handler as a named export and that the methods are in uppercase. The function receives a configuration object that defines the input schema, the handler function, and any handler level middleware.
 * @example
 * // define a handler
 * export const POST = createHandler({
 *   input: z.object({
 *    id: z.string(),
 *   }),
 *   action: async (ctx) => {
 *    return { hello: "world" };
 *  },
 *  middleware: []
 * });
 *
 * @param h @type{IHandlerConfig}
 * @returns @type{Handler}
 * @see {@link defineResource}
 */
export function createHandler<
  T extends ZodRawShape,
  O extends ZodRawShape = {}
>(h: IHandlerConfig<T, O>) {
  return h;
}

/**
 * @jsdoc
 * This is a utility function that wraps a handler function and returns a function that can be used as an Express handler. This function is used internally by the `Resource` class. It is not necessary to use this function when defining resources. It is exported for convenience.
 *
 * @param handler @type{Handler}
 * @returns @type{Handler}
 * @see {@link Resource}
 */
export function wrapHandler<I extends ZodRawShape, O extends ZodRawShape = {}>(
  handler: Handler<I, O>,
  cfg: BfConfig
): RequestHandler {
  return async (req: ExpressReq, res: ExpressRes, next: NextFunction) => {
    const ctx =
      (req.sharedCtx as Context<ZodObject<I>>) ??
      new Context<ZodObject<I>>(req, res, next, cfg.$database, cfg);

    req.sharedCtx = ctx; // plant ctx in req object for reuse

    let value;
    try {
      value = await handler(ctx);
    } catch (error) {
      // in the case user `throws` the error
      return next(error);
    }

    // in the case user `returns` the error
    if (value instanceof GenericException) return next(value); // forward error
    else if (value instanceof ServerResponse) return; // response already sent
    else if (
      typeof value === "object" &&
      !Array.isArray(value) &&
      ("statusCode" in value || "headers" in value)
    ) {
      const { statusCode, headers, ...body } = value;
      return res
        .status(statusCode || res.statusCode || 200)
        .set(headers)
        .send(body);
    } else if (isRawValue(value) || typeof value === "object") {
      // return plain values
      return res.status(200).send(value);
    }
  };
}

export class ResourceConfig {
  #afterAll?: BfHandler;
  #beforeAll?: BfHandler;
  #handlers?: IHandlers;
  #listeners?: NspListener;
  #middleware?: BfHandler[];

  constructor() {
    this.#handlers = {};
    this.#middleware = [];
  }

  __config() {
    return {
      handlers: this.#handlers,
      afterAll: this.#afterAll,
      beforeAll: this.#beforeAll,
      listeners: this.#listeners,
      middleware: this.#middleware,
    };
  }

  /**
   * @jsdoc
   * The `handle` method is used to define a handler for a specific method. It is used when defining resources using the `defineResource` function. The method returns the resource itself, allowing for chaining.
   * @example
   * // define a resource
   * export default defineResource()
   *  .handle("GET", {
   *     action: async (ctx) => {
   *       return { hello: "world" };
   *     },
   *  })
   *  .handle("POST", {
   *     action: async (ctx) => {
   *       return { hello: "world" };
   *     },
   *  });
   *
   * @param method @type{MethodUpper}
   * @param config @type{IHandlerConfig}
   * @returns @type{ResourceConfig}
   * @see {@link defineResource}
   * @see {@link createHandler}
   */
  handle<T extends ZodRawShape>(
    method: MethodUpper,
    config: IHandlerConfig<T, {}>
  ) {
    this.#handlers[method.toLowerCase() as Method] = config;
    return this;
  }

  /**
   * @jsdoc
   * The `middleware` method is used to define middleware for a resource. It is used when defining resources using the `defineResource` function. The method returns the resource itself, allowing for chaining. The middleware is applied to all handlers in the resource.
   * @example
   * // define a resource
   * export default defineResource()
   *  .handle("GET", {
   *      action: async (ctx) => {
   *        return { hello: "world" };
   *      },
   *  })
   *  .middleware(async (ctx) => {
   *      console.log("middleware");
   *      ctx.next();
   *  });
   * @param m @type{Handler}
   * @returns @type{ResourceConfig}
   * @see {@link defineResource}
   * @see {@link createHandler}
   */
  middleware(m: BfHandler) {
    // resource level middleware
    this.#middleware?.push(m);
    return this;
  }

  /**
   * @jsdoc
   * The `listeners` method is used to define realtime listeners for a resource. This only works when websockets have been enabled by installing the `@backframe/sockets` plugin. It is used when defining resources using the `defineResource` function. The method returns the resource itself, allowing for chaining. It receives a listener as shown in the example below. `NOTE` that listeners are defined on a namespace corresponding to the resource route and not the default namespace.
   * @example
   * // define a resource
   * export default defineResource()
   *   .listeners((nsp) => {
   *      nsp.on("connection", (socket) => {
   *        socket.on("message", (msg) => {
   *        console.log(msg);
   *      });
   *   });
   * @param lstnr @type{NspListener}
   * @returns @type{ResourceConfig}
   * @see {@link defineResource}
   */
  listeners(lstnr: NspListener) {
    this.#listeners = lstnr;
    return this;
  }

  /**
   * @jsdoc
   * The `beforeAll` method is used to define a handler that is executed before all handlers in the resource. It is used when defining resources using the `defineResource` function and returns the resource itself, allowing for chaining. The handler is executed before any other handlers in the resource. It receives a context object as shown in the example below.
   * @example
   * // define a resource
   * export default defineResource()
   *   .beforeAll(async (ctx) => {
   *      console.log("before all");
   *      ctx.next();
   *   })
   *   .handle("GET", {
   *     action: async (ctx) => {
   *      return { hello: "world" };
   *     },
   *   });
   * @param handler @type{Handler}
   * @returns @type{ResourceConfig}
   * @see {@link defineResource}
   */
  beforeAll(handler: BfHandler) {
    this.#beforeAll = handler;
    return this;
  }

  /**
   * @jsdoc
   * The `afterAll` method is used to define a handler that is executed after all handlers in the resource. It is used when defining resources using the `defineResource` function and returns the resource itself, allowing for chaining. The handler is executed after all other handlers in the resource. It receives a context object as shown in the example below.
   * @example
   * // define a resource
   * export default defineResource()
   *   .afterAll(async (ctx) => {
   *      console.log("after all");
   *      ctx.next();
   *   })
   *   .handle("GET", {
   *     action: async (ctx) => {
   *      return { hello: "world" };
   *     },
   *   });
   */
  afterAll(handler: BfHandler) {
    this.#afterAll = handler;
    return this;
  }
}

export function _getStaticHandler(method: Method, route: string) {
  const m = method.toUpperCase();
  return createHandler({
    action(ctx) {
      return ctx.json({
        status: "Okay",
        msg: `The \`${m}\` method for the \`${route}\` route is working successfully.`,
        body: `This is a default static handler. It can be overriden by defining your own handler for the \`${m}\` method or by defining a model in the config of the \`${route}\` route.`,
      });
    },
  });
}

export class DefaultHandlers<T> {
  #db: DB;
  #model: string;
  #dbObject: DbEntry<unknown>;

  constructor(r: Resource<T>, bfConfig: BfConfig) {
    this.#db = bfConfig.$database as DB;
    this.#model = r.resolveModel();
    this.#dbObject = this.#db?.[this.#model];
  }

  GET() {
    const dbObject = this.#dbObject;
    return createHandler({
      async action(ctx) {
        let data;

        // check if [param] exists
        const k = Object.keys(ctx.params)[0] ?? undefined;
        const v = Object.values(ctx.params)[0] ?? undefined;

        if (k && v) {
          // get one from collection
          try {
            data = await dbObject.findUnique({
              where: {
                [k]: v,
              },
            });
          } catch (error) {
            return ctx.json(
              {
                status: "Error",
                msg: error.message ?? "An error occurred.",
              },
              400
            );
          }
        } else {
          // get multiple objects from collection
          // TODO: update pagination options
          try {
            const values = await dbObject.findMany({
              skip: Number(ctx.query.skip ?? 0),
              take: Number(ctx.query.take ?? 10),
              orderBy: ctx.query.orderBy ?? undefined,
            });
            data = {
              count: values.length,
              page: Number(ctx.query.skip ?? 0),
              data: values,
            };
          } catch (error) {
            return ctx.json(
              {
                status: "Error",
                msg: error.message ?? "An error occurred.",
              },
              400
            );
          }
        }

        return ctx.json(data as object);
      },
    });
  }

  POST() {
    const dbObject = this.#dbObject;
    return createHandler({
      async action(ctx) {
        try {
          const item = await dbObject.create({ data: ctx.input });
          return ctx.json(item as object);
        } catch (error) {
          return ctx.json(new GenericException(400, error.message, ""), 400);
        }
      },
    });
  }

  PUT() {
    const dbObject = this.#dbObject;
    return createHandler({
      async action(ctx) {
        try {
          const item = await dbObject.update({
            where: {
              id: ctx.params.id,
            },
            data: ctx.input,
          });
          return ctx.json(item as object);
        } catch (error) {
          return ctx.json(new GenericException(400, error.message, ""), 400);
        }
      },
    });
  }

  DELETE() {
    const dbObject = this.#dbObject;
    return createHandler({
      async action(ctx) {
        try {
          const item = await dbObject.delete({
            where: {
              id: ctx.params.id,
            },
          });
          return ctx.json(item as object);
        } catch (error) {
          return ctx.json(new GenericException(400, error.message, ""), 400);
        }
      },
    });
  }

  PATCH() {
    const dbObject = this.#dbObject;
    return createHandler({
      async action(ctx) {
        try {
          const item = await dbObject.update({
            where: {
              id: ctx.params.id,
            },
            data: ctx.input,
          });
          return ctx.json(item as object);
        } catch (error) {
          return ctx.json(new GenericException(400, error.message, ""), 400);
        }
      },
    });
  }

  STATIC(method: Method, route: string) {
    const m = method.toUpperCase();
    return createHandler({
      action(ctx) {
        return ctx.json({
          status: "Okay",
          msg: `The \`${m}\` method for the \`${route}\` route is working successfully.`,
          body: `This is a default static handler. It can be overriden by defining your own handler for the \`${m}\` method or by defining a model in the config of the \`${route}\` route.`,
        });
      },
    });
  }
}
