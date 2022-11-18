import { BfConfig } from "@backframe/core";
import { logger, resolveCwd } from "@backframe/utils";
import cors, { CorsOptions } from "cors";
import express, {
  Express,
  NextFunction,
  Request as ExpressReq,
  Response as ExpressRes,
} from "express";
import fs from "fs";
import helmet from "helmet";
import { Server as HttpServer, ServerResponse } from "http";
import path from "path";
import { createContext } from "./context.js";
import {
  GenericException,
  MethodNotAllowed,
  NotFoundExeption,
} from "./errors.js";
import { loadResources, Resource } from "./resources.js";
import { BfRequestHandler, MethodName, _resolveMethod } from "./util.js";

interface IBfServerConfig {
  port?: number;
  enableCors?: boolean;
  corsOptions?: CorsOptions;
  enableLogger?: boolean;
}

export class BfServer {
  private _cfg!: IBfServerConfig;
  private _app!: Express;
  private _handle!: HttpServer;
  private _bfConfig!: BfConfig;
  private _middleware!: (() => void)[];
  private _resources!: Resource[];

  constructor(cfg: IBfServerConfig) {
    this._cfg = cfg;
    this._middleware = [];
    this._app = express();
  }

  async _initialize(cfg: BfConfig) {
    cfg._setServer(this);
    this._bfConfig = cfg;

    this._applyMiddleware();
    this._loadResources();
    cfg._invokeListeners("beforeServerStart");
    this._setupErrHandlers();
  }

  private _loadResources() {
    this._resources = loadResources(this._bfConfig);
    this._resources.forEach((r) => {
      this._registerResource(r);
    });

    const source = this._bfConfig.getFileSource() ?? "src";
    const staticDir = this._bfConfig.getSettings().staticDir ?? "static";
    const staticPath = resolveCwd(path.join(source, staticDir));
    if (fs.existsSync(staticPath)) {
      logger.info(`using \`${staticDir}\` as static directory`);
      this._app.use(`/${staticDir}`, express.static(staticPath));
    }
  }

  private _applyMiddleware() {
    this._app.use(helmet());
    const useCors = this._cfg.enableCors;
    const log = this._cfg.enableLogger;

    useCors && this._app.use(cors(this._cfg.corsOptions));
    log &&
      this._app.use((req, res, next) => {
        const start = Date.now();
        next();
        logger.http(
          `${req.method} ${req.originalUrl} HTTP/${req.httpVersion} -> ${
            res.statusCode
          } in ${Date.now() - start}ms`
        );
      });
  }

  private _setupErrHandlers() {
    // at this point, no route has been found
    this._app.use("*", (req, _res, _next) => {
      if (this._resources.some((r) => r.route === req.originalUrl))
        throw MethodNotAllowed(
          "Method Not Allowed",
          `The \`${req.method}\` method is not allowed on this resource`
        );
      throw NotFoundExeption();
    });

    this._app.use(
      (
        err: GenericException,
        _req: ExpressReq,
        res: ExpressRes,
        _next: NextFunction
      ) => {
        res.status(err.statusCode).json(err.getValues());
      }
    );
  }

  private _wrapMiddleware(m: BfRequestHandler) {
    return (req: ExpressReq, res: ExpressRes, next: NextFunction) => {
      const ctx = createContext(req, res, next);
      const value = m(ctx);

      if (value instanceof GenericException) next(value);
      else if (typeof value === "undefined") next();
      else return;
    };
  }

  private _wrapHandler(handler: BfRequestHandler) {
    // @ts-ignore
    return (req: ExpressReq, res: ExpressRes, next: NextFunction) => {
      const ctx = createContext(req, res, next, this._bfConfig);
      const value = handler(ctx);

      if (value instanceof GenericException) next(value);
      else if (value instanceof ServerResponse) return;
      else if (typeof value === "undefined") {
        if (res.hasHeader("content-type")) return;
        return res
          .status(200)
          .setHeader("Content-Type", "text/html")
          .send("Okay!");
      } else {
        const t = typeof value === "object" ? "application/json" : "text/html";
        const m = typeof value === "object" ? "json" : "send";
        return res.status(200).setHeader("Content-Type", t)[m](value);
      }
    };
  }

  private _registerResource(r: Resource) {
    const mware = r.middleware ?? [];
    const methods = Object.keys(r.handlers);

    methods.forEach((m) => {
      const method = _resolveMethod(m);
      const _middleware = mware.map((mw) => this._wrapMiddleware(mw));
      const handler = this._wrapHandler(r.handlers[m as MethodName]!.action);
      this._app[method](r.route, _middleware, handler);
    });
  }

  async start(port = this._cfg.port || 6969) {
    this._handle = this._app.listen(port, () => {
      // TODO: expose flags etc...
      logger.info(`server started on ${this.getHost(port)}`);
      this._bfConfig._invokeListeners("afterServerStart");
    });
  }

  stop(callback?: (err?: Error | undefined) => void | undefined) {
    this._handle.close(callback);
  }

  getHost(port = this._cfg.port || 6969) {
    return `http://localhost:${port}`;
  }
}

export function defaultServer() {
  return new BfServer({
    port: 6969,
    enableCors: true,
    enableLogger: true,
  });
}

export function createServer(cfg: IBfServerConfig) {
  return new BfServer(cfg);
}
