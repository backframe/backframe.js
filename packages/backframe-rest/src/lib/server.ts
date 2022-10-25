import type {
  BfConfig,
  BfRequestHandler,
  BfResourceConfig,
  IHandlerContext,
  Listener,
  MethodName,
} from "@backframe/core";
import { logger } from "@backframe/utils";
import cors, { CorsOptions } from "cors";
import express, {
  ErrorRequestHandler,
  Express,
  Request as ExpressReq,
  Response as ExpressRes,
} from "express";
import helmet from "helmet";
import { Server as HttpServer } from "http";
import { resolveRoutes } from "./routes.js";

// cors options
// request logger
interface ServerConfig {
  port?: number;
  globalMiddleware?: BfRequestHandler[];
  cors?: {
    enabled: boolean;
    options?: CorsOptions;
  };
  logRequests?: boolean;
}

export class BfServer {
  public _app: Express;
  public _handle!: HttpServer;
  public _resources!: BfResourceConfig[];
  private _appCfg!: BfConfig;

  constructor(public cfg: ServerConfig) {
    this._app = express();
  }

  async __initialize(cfg: BfConfig) {
    cfg._setServer(this);
    this._appCfg = cfg;
    const resources = await resolveRoutes(cfg);
    resources.forEach((r) => {
      this.addResource(r as BfResourceConfig);
    });
    this._resources = resources;

    // invoke plugins before server starts
    cfg._invokePlugins("beforeServerStart");
    return cfg;
  }

  async __resolveRoutes(cfg: BfConfig) {
    const resources = await resolveRoutes(cfg);
    resources.forEach((r) => {
      this.addResource(r as BfResourceConfig);
    });
    this._resources = resources;
  }

  public start(port = this.cfg.port) {
    this.applyMiddleware();
    this._handle = this._app.listen(port, () => {
      const host = `http://localhost:${port}`;
      logger.info(`server started on ${host}`);
      if (this._appCfg._cfg.plugins?.includes("@backframe/admin" as Listener)) {
        logger.info(`admin ui ready on ${host}/admin`);
      }
    });
  }

  public stop(callback?: (err?: Error | undefined) => void | undefined) {
    this._handle.close(callback);
  }

  private applyMiddleware() {
    this._app.use(helmet());
    this.cfg.cors?.enabled && this._app.use(cors(this.cfg.cors.options ?? {}));
    if (this.cfg.logRequests) this._app.use(RequestLogger());

    const errHandler: ErrorRequestHandler = (err, req, res, next) => {
      res.status(404).json({
        statusCode: 404,
        error: "Not Found",
        msg: `Cannot ${req.method} ${req.path}`,
      });
    };
    this._app.use(errHandler);
  }

  private _wrapHandler(method: MethodName, r: BfResourceConfig) {
    return (req: ExpressReq, res: ExpressRes) => {
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
      const val = r.handlers[method as MethodName]!(ctx);
      const t = typeof val === "string" ? "text/html" : "application/json";
      return res.status(200).setHeader("Content-Type", t).json(val);
    };
  }

  addResource(r: BfResourceConfig) {
    const middleware = r.routeConfig.middleware ?? [
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (_rq: any, _rs: any, next: () => any) => next(),
    ];
    const methods = Object.keys(r.handlers);

    methods.forEach((m) => {
      if (m === "getOne") {
        this._app.get(
          `${r.route}/:id`,
          middleware,
          this._wrapHandler("getOne", r)
        );
      } else {
        type value = "get" | "post" | "put" | "delete" | "patch";
        this._app[m as value](
          r.route,
          middleware,
          this._wrapHandler(m as MethodName, r)
        );
      }
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addMiddleware(m: any) {
    this._app.use(m);
  }
}

export function createServer(cfg: ServerConfig) {
  return new BfServer(cfg);
}

export function defaultServer() {
  return new BfServer({
    port: 6969,
    logRequests: true,
    cors: {
      enabled: true,
    },
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const RequestLogger = () => (req: ExpressReq, res: ExpressRes, next: any) => {
  logger.http(
    `${req.method} ${req.path} HTTP/${req.httpVersion} -> ${res.statusCode}`
  );
  next();
};
