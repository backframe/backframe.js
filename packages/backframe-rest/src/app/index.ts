import type { BfConfig } from "@backframe/core";
import { logger } from "@backframe/utils";
import cors, { CorsOptions } from "cors";
import express, {
  NextFunction,
  Request as ExpressReq,
  Response as ExpressRes,
  type Express,
} from "express";
import helmet from "helmet";
import { Server as HttpServer, ServerResponse } from "http";
import { ZodObject, ZodRawShape, ZodType } from "zod";
import {
  GenericException,
  MethodNotAllowed,
  NotFoundExeption,
} from "../lib/errors.js";
import { Handler, IHandlerConfig } from "../lib/types.js";
import { Router } from "../routing/router.js";
import { Context } from "./context.js";
import { _stdToCrud } from "./handlers.js";
import {
  BfMethod,
  ExpressMethods as ExpressMethod,
  Resource,
  STD_METHODS,
} from "./resources.js";

interface IBfServerConfig {
  port?: number;
  enableCors?: boolean;
  corsOptions?: CorsOptions;
  logRequests?: boolean;
  logAdminRequests?: boolean;
}

const DEFAULT_PORT = 6969;

export class BfServer {
  _app: Express;
  _handle?: HttpServer;

  #router: Router;
  #bfConfig!: BfConfig;
  #resources!: Resource<unknown>[];
  #middleware: Handler<{}>[];

  constructor(private _cfg: IBfServerConfig) {
    this._app = express();
    this.#middleware = [];
    this.#resources = [];
  }

  async __init(cfg: BfConfig) {
    cfg.server = this;

    this.#bfConfig = cfg;
    this.#router = new Router(cfg);

    this.#router.init();
    this.#applyMiddleware();

    await this.#loadResources();
    cfg.__invokeServerModifiers();

    this.#setupErrHandlers(); // ensure called last
  }

  #getHost(port = this._cfg.port || DEFAULT_PORT) {
    return `http://localhost:${port}`;
  }

  #wrapMiddleware<T extends ZodRawShape>(m: Handler<T>) {
    return (req: ExpressReq, res: ExpressRes, next: NextFunction) => {
      const ctx = new Context<ZodObject<T>>(req, res, next);
      const value = m(ctx);

      if (value instanceof GenericException) next(value);
      else return;
    };
  }

  #wrapHandler<T extends ZodRawShape>(handler: Handler<T>) {
    // @ts-ignore (same reason)
    return (req: ExpressReq, res: ExpressRes, next: NextFunction) => {
      const ctx = new Context<ZodObject<T>>(req, res, next, this.#bfConfig);
      const value = handler(ctx);

      if (value instanceof GenericException) next(value);
      // @ts-ignore (response has already been sent)
      else if (value instanceof ServerResponse) return;
      else {
        const t = typeof value === "object" ? "application/json" : "text/html";
        const m = typeof value === "object" ? "json" : "send";
        return res.status(200).setHeader("Content-Type", t)[m](value);
      }
    };
  }

  #loadResources() {
    const manifest = this.#router.manifest;
    manifest.items.forEach((i) => {
      const r = new Resource(i, this.#bfConfig);
      if (!this.#resources.some((_) => _.route === r.route))
        this.#resources.push(r);
    });

    // init all resources
    return Promise.all(
      this.#resources.map(async (r) => {
        await r.initialize();
        const handlers = r.handlers ?? {};
        const globalMware = this.#middleware?.concat(r.middleware ?? []);

        Object.keys(handlers).forEach((k) => {
          if (STD_METHODS.includes(k)) {
            const method = k.toLowerCase() as ExpressMethod;
            let wrapped = globalMware.map((m) => this.#wrapMiddleware(m));

            const { action, input, middleware } = r.handlers[
              k as BfMethod
            ] as IHandlerConfig<{}>;

            // add validator
            if (input) {
              wrapped.push(this.#validator(input));
            }

            // wrap handlers in format express understands
            middleware?.forEach((m) => wrapped.push(this.#wrapMiddleware(m)));
            wrapped.push(this.#wrapHandler(action));

            // passport secured route middleware
            // if method enabled, if strategy included, if
            if (!r.public.includes(_stdToCrud(k)) && this.#bfConfig.__auth) {
              // -> insert as first middleware
              wrapped.unshift(this.#bfConfig.__authMiddleware);
            }

            // mount resource on express app
            this._app[method](r.route, wrapped);
          }
        });
      })
    );
  }

  #validator(input: ZodType) {
    return (req: ExpressReq, _res: ExpressRes, next: NextFunction) => {
      const opts = input.safeParse(req.body);
      if (!opts.success) {
        next(
          new GenericException(
            400,
            "Invalid request body",
            "The request body is not valid"
          )
        );
      } else {
        next();
      }
    };
  }

  #applyMiddleware() {
    this._app.use(helmet());
    this._app.use(express.json({ limit: "20mb" }));
    this._app.use(express.urlencoded({ extended: true }));
    if (this.#bfConfig.__auth) {
      // -> passport.initialize()
      this._app.use(this.#bfConfig.__auth);

      // -> passport strategies
      this.#bfConfig.__authStrategies();
    }

    const useCors = this._cfg.enableCors;
    const log = this._cfg.logRequests;
    const logAdmin = this._cfg.logAdminRequests;

    useCors && this._app.use(cors(this._cfg.corsOptions));
    if (log) {
      this._app.use((req, res, next) => {
        const start = Date.now();
        next();
        if (req.originalUrl.startsWith("/_/") && !logAdmin) return;
        logger.http(
          `${req.method} ${req.originalUrl} HTTP/${req.httpVersion} -> ${
            res.statusCode
          } in ${Date.now() - start}ms`
        );
      });
    }
  }

  #setupErrHandlers() {
    // at this point, no route has been found
    this._app.use("*", (req, _res, _next) => {
      if (this.#resources.some((r) => r.route === req.originalUrl))
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

  listRoutes() {
    console.log(this.#router.manifest.routes);
  }

  mountRoute() {
    //
  }

  async start(port = this._cfg.port || DEFAULT_PORT) {
    this._cfg.port = port;
    this._handle = this._app.listen(port, () => {
      // TODO: expose flags etc...
      logger.info(`server started on: ${this.#getHost()}`);
    });
  }

  stop(cb: (e?: Error) => void) {
    this._handle.close(cb);
  }
}

export function defaultServer() {
  return new BfServer({
    port: 6969,
    enableCors: true,
    logRequests: true,
    logAdminRequests: false,
  });
}

export function createServer(cfg: IBfServerConfig) {
  return new BfServer(cfg);
}

// TODO: Make app private
// TODO: add settings options
// TODO: Router/Manifest to check for routing conflicts
// TODO: Make router plugin friendly... i.e. route value, route provider/origin
