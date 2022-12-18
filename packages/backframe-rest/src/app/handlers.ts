/* eslint-disable @typescript-eslint/ban-types  */

import { ZodRawShape } from "zod";
import { Handler, IHandlerConfig, IHandlers, Method } from "../lib/types.js";

export function defineHandlers() {
  return new ResourceModule();
}

export function createHandler<T extends ZodRawShape>(h: IHandlerConfig<T>) {
  return h;
}

export class ResourceModule {
  __middleware?: Handler<{}>[];
  __handlers?: IHandlers;

  constructor() {
    this.__handlers = {};
    this.__middleware = [];
  }

  handle<T extends ZodRawShape>(method: Method, config: IHandlerConfig<T>) {
    this.__handlers[method] = config;
    return this;
  }

  middleware(m: Handler<{}>) {
    // resource level middleware
    this.__middleware?.push(m);
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
