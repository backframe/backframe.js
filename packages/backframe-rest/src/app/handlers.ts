import { ZodRawShape } from "zod";
import {
  Handler,
  IHandlerConfig,
  IModuleConfig,
  Method,
} from "../lib/types.js";
import { DEFAULT_ENABLED } from "./resources.js";

// extract handlers from a file
export function __getHandlers(module: IModuleConfig<unknown>, route: string) {
  const enabled = module.config?.enabled ?? DEFAULT_ENABLED;
  if (!module.default) {
    const rh = new ResourceHandlers();
    enabled.forEach(
      // @ts-ignore
      (e) => (rh[resolveMethod(e)] = _staticHandler(e, route))
    );
    return rh;
  } else {
    enabled.forEach((e) => {
      // @ts-ignore
      const value = module.default[resolveMethod(e)];
      if (!value) {
        // @ts-ignore
        module.default[resolveMethod(e)] = _staticHandler(e, route);
      }
    });

    return module.default;
  }
}

export function defineHandlers() {
  return new ResourceHandlers();
}

export function createHandler<T extends ZodRawShape>(h: IHandlerConfig<T>) {
  return h;
}

export class ResourceHandlers {
  // NOTE(vndaba): This props are defined privately to prevent the user from accessing them directly. They will still be used outside this class by breaking ts rules with @ts-ignore
  #GET?: IHandlerConfig<{}>;
  #POST?: IHandlerConfig<{}>;
  #PUT?: IHandlerConfig<{}>;
  #DELETE?: IHandlerConfig<{}>;

  __middleware?: Handler<{}>[];

  constructor() {
    this.__middleware = [];
  }

  handle<T extends ZodRawShape>(method: Method, config: IHandlerConfig<T>) {
    const m = resolveMethod(method);
    // @ts-ignore
    this[m] = config;
    return this;
  }

  middleware(m: Handler<{}>) {
    // resource level middleware cannot be typed
    this.__middleware?.push(m);
    return this;
  }
}

export function isHandlerKey(k: string) {
  return k === "#GET" || k === "#POST" || k === "#PUT" || k === "#DELETE";
}

export function resolveMethod(m: Method) {
  if (m === "create") return "#POST";
  if (m === "read") return "#GET";
  if (m === "update") return "#PUT";
  return "#DELETE";
}

export function standardizeMethod(m: string) {
  if (m === "#GET") return "get";
  if (m === "#POST") return "post";
  if (m === "#PUT") return "put";
  return "delete";
}

export function _resolveMethod(m: string) {
  if (m === "create") return "post";
  if (m === "read") return "get";
  if (m === "update") return "put";
  return "delete";
}

function _staticHandler(method: Method, route: string) {
  const m = _resolveMethod(method).toUpperCase();
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
