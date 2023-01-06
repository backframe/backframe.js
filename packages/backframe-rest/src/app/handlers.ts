/* eslint-disable @typescript-eslint/ban-types  */

import { BfConfig } from "@backframe/core";
import type { DB, DbEntry } from "@backframe/models";
import { ZodRawShape } from "zod";
import { GenericException } from "../lib/errors.js";
import {
  H,
  Handler,
  IHandlerConfig,
  IHandlers,
  Method,
  MethodUpper,
  NspListener,
} from "../lib/types.js";
import { Resource } from "./resources.js";

export function defineResource() {
  return new ResourceConfig();
}

export function createHandler<T extends ZodRawShape>(h: IHandlerConfig<T>) {
  return h;
}

export class ResourceConfig {
  #afterAll?: H;
  #beforeAll?: H;
  #handlers?: IHandlers;
  #listeners?: NspListener;
  #middleware?: Handler<unknown, {}>[];

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

  handle<T extends ZodRawShape>(
    method: MethodUpper,
    config: IHandlerConfig<T>
  ) {
    this.#handlers[method.toLowerCase() as Method] = config;
    return this;
  }

  middleware(m: Handler<unknown, {}>) {
    // resource level middleware
    this.#middleware?.push(m);
    return this;
  }

  listeners(lstnr: NspListener) {
    this.#listeners = lstnr;
    return this;
  }

  beforeAll(handler: H) {
    this.#beforeAll = handler;
    return this;
  }

  afterAll(handler: H) {
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
    this.#db = bfConfig.database as DB;
    this.#model = (r.model as string) ?? r.route;
    this.#dbObject = this.#db[this.#model] ?? this.#db[r.routeItem.dirname];
  }

  GET() {
    const dbObject = this.#dbObject;
    return createHandler({
      async action(ctx) {
        let data;

        // check if [param] exists
        const k = Object.keys(ctx.params)[0] ?? "";
        const v = Object.values(ctx.params)[0] ?? "";

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
