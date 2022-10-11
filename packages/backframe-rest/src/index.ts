import { IRouteConfig } from "@backframe/core";

export { defineHandlers } from "./lib/handlers.js";
export { createServer, defaultServer } from "./lib/server.js";
export const defineRouteConfig = (cfg: IRouteConfig) => cfg;
