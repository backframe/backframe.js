import {
  BfConfig,
  BfResourceConfig,
  IModuleConfig,
  IRouteConfig,
} from "@backframe/core";
import { loadModule, logger, resolveCwd } from "@backframe/utils";
import pkg from "glob";
import path from "path";
import { _parseHandlers } from "./handlers.js";
const { glob } = pkg;

export async function resolveRoutes(bfConfig: BfConfig) {
  const src = bfConfig.getFileSource();
  const dir = `./${src}/routes/**/*.js`;
  const matches = glob.sync(dir);
  const debug = process.env.BF_DEBUG;

  if (!matches.length) {
    logger.error("no routes were detected. exiting...");
    process.exit(1);
  }

  const prefix = bfConfig.getRestConfig()?.urlPrefix ?? "/";
  const resources = await Promise.all(
    matches.map(async (match) => {
      let file = match.replace(`./${src}/routes`, "");
      file = path.join(prefix, file);

      let base: string;
      const name = path.basename(file);
      const parts = name.split(".");

      if (parts.length > 2) {
        parts.pop(); // pop out ext
        base = parts.join("/");
      } else {
        base = parts[0];
      }

      base = base.replace("index", "");
      const route = path.join(path.dirname(file), base).replace(/\\/g, "/");

      // 2: import file and parse required options
      const module: IModuleConfig = await loadModule(resolveCwd(match));
      const isResource = () => {
        const { default: d, config } = module;
        return d.handlers?.length || config;
      };

      const config: BfResourceConfig = {
        route,
        handlers: _parseHandlers(module, route),
        routeConfig: Object.assign(generateRouteConfig(), module.config ?? {}),
      };
      return config;
    })
  );

  debug && console.log(resources);
  return resources;
}

function generateRouteConfig(): IRouteConfig {
  return {
    enabled: ["get", "getOne", "post", "put", "delete"],
    public: ["get"],
  };
}
