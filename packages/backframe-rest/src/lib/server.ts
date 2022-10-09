import type {
  BfRequestHandler,
  BfResourceConfig,
  IHandlerContext,
  MethodName,
} from "@backframe/core";
import { logger } from "@backframe/utils";
import cors, { CorsOptions } from "cors";
import express, {
  Express,
  Request as ExpressReq,
  Response as ExpressRes,
} from "express";
import helmet from "helmet";
import { Server as HttpServer } from "http";
import { z } from "zod";

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

  constructor(public cfg: ServerConfig) {
    this._app = express();
  }

  public start(port = this.cfg.port) {
    this.applyMiddleware();
    this._handle = this._app.listen(port, () => {
      logger.info(`server started on port: ${port}`);
    });
  }

  public stop(callback?: (err?: Error | undefined) => void | undefined) {
    this._handle.close(callback);
  }

  private applyMiddleware() {
    this._app.use(helmet());
    this.cfg.cors?.enabled && this._app.use(cors(this.cfg.cors.options ?? {}));
    if (this.cfg.logRequests !== false) this._app.use(RequestLogger());
  }

  private _wrapHandler(method: MethodName, r: BfResourceConfig) {
    return (req: ExpressReq, res: ExpressRes) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const model = r.routeConfig.model!;
      const schema = model.__genSchema();
      const input: z.infer<typeof schema> = req.body;
      const ctx: IHandlerContext = {
        _req: req,
        _res: res,
        db: {},
        auth: {},
        input: input as z.infer<typeof schema>,
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
  logger.info(
    `${req.method} ${req.path} HTTP/${req.httpVersion} -> ${res.statusCode}`
  );
  next();
};
