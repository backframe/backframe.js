import { IRouteConfig } from "./lib/util.js";

export { Context } from "./lib/context.js";
export {
  ForbiddenException,
  GenericException,
  InternalException,
  NotFoundExeption,
  UnauthorizedException,
} from "./lib/errors.js";
export { defineHandlers } from "./lib/handlers.js";
export { createServer, defaultServer } from "./lib/server.js";
export const defineRouteConfig = (cfg: IRouteConfig) => cfg;
