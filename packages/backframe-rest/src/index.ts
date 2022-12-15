import { IRouteConfig } from "./lib/types.js";

// re-export to house all-in-one
export { z } from "zod";
export { Context } from "./app/context.js";
export { createHandler, defineHandlers } from "./app/handlers.js";
export { BfServer, createServer, defaultServer } from "./app/index.js";
export * from "./lib/errors.js";
export {
  Handler,
  IHandlerConfig,
  IModuleConfig,
  IRouteConfig,
  Method,
} from "./lib/types.js";
export const defineRouteConfig = <T>(cfg: IRouteConfig<T>) => cfg;
