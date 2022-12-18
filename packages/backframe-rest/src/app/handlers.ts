/* eslint-disable @typescript-eslint/ban-types  */

import { ZodRawShape } from "zod";
import { Handler, IHandlerConfig, Method } from "../lib/types.js";

export function defineHandlers() {
  return new ResourceHandlers();
}

export function createHandler<T extends ZodRawShape>(h: IHandlerConfig<T>) {
  return h;
}

export class ResourceHandlers {
  GET?: IHandlerConfig<{}>;
  POST?: IHandlerConfig<{}>;
  PUT?: IHandlerConfig<{}>;
  DELETE?: IHandlerConfig<{}>;
  PATCH?: IHandlerConfig<{}>;

  __middleware?: Handler<{}>[];

  constructor() {
    this.__middleware = [];
  }

  handle<T extends ZodRawShape>(method: Method, config: IHandlerConfig<T>) {
    const m = _crudToStd(method);
    this[m] = config;
    return this;
  }

  middleware(m: Handler<{}>) {
    // resource level middleware
    this.__middleware?.push(m);
    return this;
  }
}

// transform "create" | "read" | "update" -> GET etc...
export function _crudToStd(m: Method) {
  if (m === "create") return "POST";
  if (m === "read") return "GET";
  if (m === "update") return "PUT";
  if (m === "delete") return "DELETE";
  throw new Error(`found invalid method name while converting to std: ${m}`);
}

export function _stdToCrud(m: string) {
  if (m === "POST") return "create";
  if (m === "GET") return "read";
  if (m === "PUT") return "update";
  if (m === "DELETE") return "delete";
  throw new Error(`found invalid method name while converting to crud: ${m}`);
}

export function _getStaticHandler(method: Method, route: string) {
  const m = _crudToStd(method);
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
