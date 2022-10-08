import {
  IBfConfigInternal,
  IHandlerContext,
  IRouteConfig,
  MethodName,
} from "@backframe/core";
import express, { Request, Response } from "express";
import { resolveRoutes } from "./lib/routes.js";

export default async function (cfg: IBfConfigInternal) {
  const server = express();
  const resources = await resolveRoutes(cfg);

  resources.forEach((r) => {
    console.log(Object.keys(r.handlers));
    const middleware = r.routeConfig.middleware ?? [
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (_rq: any, _rs: any, next: () => any) => next(),
    ];
    const _include = (val: MethodName) => Object.keys(r.handlers).includes(val);
    const _handle = (method: MethodName) => (req: Request, res: Response) => {
      const ctx: IHandlerContext = {
        _req: req,
        _res: res,
        db: {},
        auth: {},
        input: {},
        params: req.params,
        query: req.query,
      };

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const val = r.handlers[method as MethodName]!(ctx);
      const t = typeof val === "string" ? "text/html" : "application/json";
      return res.status(200).setHeader("Content-Type", t).json(val);
    };

    _include("getOne") &&
      server.get(`${r.route}/:id`, middleware, _handle("getOne"));
    _include("get") && server.get(r.route, middleware, _handle("get"));
    _include("post") && server.post(r.route, middleware, _handle("post"));
    _include("put") && server.put(r.route, middleware, _handle("put"));
    _include("delete") && server.delete(r.route, middleware, _handle("delete"));
  });

  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
  });
}

export { defineHandlers } from "./lib/handlers.js";
export const defineRouteConfig = (cfg: IRouteConfig) => cfg;
