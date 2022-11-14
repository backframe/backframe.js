import {
  BfConfig,
  BfResourceConfig,
  IHandlerContext,
  MethodName,
} from "@backframe/core";
import { logger } from "@backframe/utils";
import cors, { CorsOptions } from "cors";
import express, {
  Express,
  NextFunction,
  Request as ExpressReq,
  Response as ExpressRes,
} from "express";
import helmet from "helmet";
import { Server as HttpServer } from "http";
import { GenericException, NotFoundExeption } from "./errors.js";
import { resolveRoutes } from "./routes.js";

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
  private _resources!: BfResourceConfig[];

  constructor(cfg: IBfServerConfig) {
    this._cfg = cfg;
    this._middleware = [];
    this._app = express();
  }

  async _initialize(cfg: BfConfig) {
    cfg._setServer(this);
    this._bfConfig = cfg;
    // TODO: apply middleware
    // TODO: load resources
    // TODO: Invoke plugins beforeStart
    // TODO: setup error handlers
    this._applyMiddleware();
    const resources = await resolveRoutes(cfg);
    resources.forEach((r) => {
      this.addResource(r as BfResourceConfig);
    });
    this._resources = resources;
    cfg._invokeListeners("beforeServerStart");
    this._setupErrHandlers();
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
    this._app.use("*", (_req, _res, _next) => {
      throw NotFoundExeption();
    });

    // eslint-disable-next-line @typescript-eslint/no-implicit-any
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

  private _generateHandler(method: MethodName, r: BfResourceConfig) {
    return (req: ExpressReq, res: ExpressRes, next: NextFunction) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const ctx: IHandlerContext = {
        _req: req,
        _res: res,
        db: {},
        auth: {},
        input: req.body,
        params: req.params,
        query: req.query,
      };

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const value = r.handlers[method as MethodName]!(ctx);

      if (value instanceof GenericException) {
        next(value);
      }
      const t = typeof value === "string" ? "text/html" : "application/json";
      return res.status(200).setHeader("Content-Type", t).json(value);
    };
  }

  async start(port = this._cfg.port || 6969) {
    this._handle = this._app.listen(port, () => {
      // TODO: expose flags etc...
      const host = `http://localhost:${port}`;
      logger.info(`server started on ${host}`);
      if (this._bfConfig._includesPlugin("@backframe/admin"))
        logger.info(`admin ui ready on ${host}/admin`);
    });
  }

  stop(callback?: (err?: Error | undefined) => void | undefined) {
    this._handle.close(callback);
  }

  addResource(r: BfResourceConfig) {
    const middleware = r.routeConfig.middleware ?? [];
    const methods = Object.keys(r.handlers);

    methods.forEach((m) => {
      if (m === "getOne") {
        this._app.get(
          `${r.route}/:id`,
          middleware,
          this._generateHandler("getOne", r)
        );
      } else {
        type value = "get" | "post" | "put" | "delete" | "patch";
        this._app[m as value](
          r.route,
          middleware,
          this._generateHandler(m as MethodName, r)
        );
      }
    });
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
