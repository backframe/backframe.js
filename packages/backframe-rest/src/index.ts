import {
  IBfConfigInternal,
  IHandlerContext,
  IModuleConfig,
  IResourceConfig,
  IRouteConfig,
} from "@backframe/core";
import express, { Request, Response } from "express";
import pkg from "glob";
import path from "path";
import { _generateHandlers } from "./lib/handlers.js";
import { __parseHandlers } from "./lib/helpers.js";
const { glob } = pkg;

export default async function start(cfg: Partial<IBfConfigInternal>) {
  process.chdir("./.bf"); // -> dont forget to exit
  console.log("Backframe rest generation starting...");
  console.log(cfg);
  const matches = glob.sync("./src/routes/**/*.js");
  if (!matches.length) {
    console.log(
      "No routes were detected. Please include at least one route for the server to run."
    );
    console.log("Exiting....");
    process.exit(1);
  }

  // let prefix = cfg.interfaces?.rest?.versioned ? "/v1" : "/";
  const routes = await Promise.all(
    matches.map(async (m) => {
      const modulePath = `file://${path.join(process.cwd(), m)}`;
      const module: IResourceConfig = await import(modulePath);
      console.log(module);

      const defaultCfg: IRouteConfig = {
        name: generateRoutePath(m).replace("index", ""),
        handlers: {},
        config: {
          enabledMethods: ["get", "getOne", "post", "put", "delete"],
          publicMethods: ["get", "getOne"],
        },
      };

      module.config &&
        (defaultCfg["config"] = { ...defaultCfg.config, ...module.config });
      defaultCfg["handlers"] = _generateHandlers(defaultCfg);

      module.default &&
        (defaultCfg["handlers"] = {
          ...defaultCfg.handlers,
          ...__parseHandlers(module),
        });

      return defaultCfg;
    })
  );

  const server = express();
  routes.forEach((r) => {
    const middleware = r.config?.middleware ?? [(_req, _res, next) => next()];
    const _handler = (method: string) => (req: Request, res: Response) => {
      const ctx: IHandlerContext = { req, res };
      type MethodName = "get" | "getOne" | "post" | "put" | "delete";
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      r.handlers[method as MethodName]!(ctx);
    };
    const _include = (val: string) => {
      return Object.keys(r.handlers).includes(val);
    };

    _include("get") && server.get(r.name, middleware, _handler("get"));
    _include("post") && server.post(r.name, middleware, _handler("post"));
    _include("put") && server.put(r.name, middleware, _handler("put"));
    _include("delete") && server.delete(r.name, middleware, _handler("delete"));
  });

  console.log(routes);
  server.listen(5000, () => {
    console.log("Server is started on port 5");
  });
}

function generateRoutePath(file: string) {
  const p = file.replace("./routes", "");
  const root = path.dirname(p);
  const base = path.basename(p);
  const parts = base.split(".");

  if (parts.length > 2) {
    parts.pop(); // remove extension
    return `${path.dirname(p)}${parts.join("/")}`;
  }
  if (root === "/") return `/${parts[0]}`;
  return `${root}/${parts[0]}`;
}

export function defineRouteConfig(cfg: Partial<IModuleConfig>) {
  return cfg;
}

export { defineHandlers } from "./lib/helpers.js";
