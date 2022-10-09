import { IBfConfigInternal, IRouteConfig } from "@backframe/core";
import { logger } from "@backframe/utils";
import fs from "fs";
import path from "path";
import { resolveRoutes } from "./lib/routes.js";
import { BfServer, defaultServer } from "./lib/server.js";

const debug = process.env.BF_DEBUG;
const current = (...s: string[]) => path.join(process.cwd(), ...s);
const load = async (s: string) => await import(`file://${s}`);

export default async function (cfg: IBfConfigInternal) {
  let server: BfServer;
  // search if there is a custom server file
  const src = cfg.getFileSource();
  const file = path.join(src, cfg.settings.server ?? "server.js");

  if (fs.existsSync(file)) {
    const module = await load(current(file));
    if (!module.default) {
      logger.error(`please export a default object from ${file}`);
      process.exit(1);
    }
    server = module.default;
  } else {
    server = defaultServer();
  }

  // load resources and add them to server
  const resources = await resolveRoutes(cfg);
  resources.forEach((r) => {
    debug && console.log(Object.keys(r.handlers));
    server.addResource(r);
  });

  server.start();
  return server;
}

export { defineHandlers } from "./lib/handlers.js";
export { createServer } from "./lib/server.js";
export const defineRouteConfig = (cfg: IRouteConfig) => cfg;
