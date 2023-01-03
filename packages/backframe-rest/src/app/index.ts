/* eslint-disable @typescript-eslint/ban-types */
import type { BfConfig } from "@backframe/core";
import { logger } from "@backframe/utils";
import cors, { CorsOptions } from "cors";
import express, {
  NextFunction,
  Request as ExpressReq,
  RequestHandler,
  Response as ExpressRes,
  type Express,
} from "express";
import helmet from "helmet";
import http, { Server as HttpServer, ServerResponse } from "http";
import merge from "lodash.merge";
import { ZodObject, ZodRawShape, ZodType } from "zod";
import {
  GenericException,
  InternalException,
  MethodNotAllowed,
  NotFoundExeption,
  UnauthorizedException,
} from "../lib/errors.js";
import { Handler, IHandlerConfig, Method } from "../lib/types.js";
import { Router } from "../routing/router.js";
import { Context } from "./context.js";
import { Resource } from "./resources.js";

interface IBfServerConfig<T> {
  port?: number;
  enableCors?: boolean;
  corsOptions?: CorsOptions;
  logRequests?: boolean;
  logAdminRequests?: boolean;
  database?: T;
}

const DEFAULT_PORT = 6969;

export class BfServer<T> {
  _app: Express;
  _handle: HttpServer;
  _database?: T;

  #router: Router;
  #bfConfig!: BfConfig;
  #resources!: Resource<unknown>[];
  // eslint-disable-next-line @typescript-eslint/ban-types
  #middleware: Handler<{}>[];

  constructor(private _cfg: IBfServerConfig<T>) {
    this._app = express();
    this._database = _cfg.database;
    this._handle = http.createServer(this._app);

    this.#middleware = [];
    this.#resources = [];
  }

  async __init(cfg: BfConfig) {
    cfg.__setServer(this);
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

  #wrapHandler<Z extends ZodRawShape>(handler: Handler<Z>) {
    return async (req: ExpressReq, res: ExpressRes, next: NextFunction) => {
      const ctx = new Context<ZodObject<Z>, T>(
        req,
        res,
        next,
        this.#bfConfig,
        this._database
      );
      const value = await handler(ctx);

      const isText = (v: unknown) => {
        return (
          typeof v === "bigint" ||
          typeof v === "boolean" ||
          typeof v === "number" ||
          typeof v === "string"
        );
      };

      if (value instanceof GenericException)
        return next(value); // forward error
      else if (value instanceof ServerResponse) return; // response already sent
      else if (isText(value) || typeof value === "object") {
        // return plain values
        return res.status(200).send(value);
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
          const method = k as Method;
          type T = (
            req: ExpressReq,
            res: ExpressRes,
            next: NextFunction
          ) => void | Promise<void | ExpressRes> | ExpressRes;

          const { action, input, middleware } = r.handlers[
            method as Method
          ] as IHandlerConfig<{}>;

          const handlers: T[] = [...globalMware, ...middleware, action].map(
            (h) => this.#wrapHandler(h)
          );

          // add validator
          if (input) {
            handlers.unshift(this.#validator(input));
          }

          // passport secured route middleware
          // if method enabled, if strategy included, if
          const shouldSecure = () => {
            return !r.public?.includes(method) && this.#bfConfig.authentication;
          };

          if (shouldSecure()) {
            // -> insert as first middleware
            handlers.unshift(this.#protect());
          }

          // mount resource on express app
          this._app[method](r.route, handlers);
        });
      })
    );
  }

  #protect() {
    return (req: ExpressReq, _res: ExpressRes, next: NextFunction) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (!req.user) {
        next(UnauthorizedException());
      } else {
        next();
      }
    };
  }

  #validator(input: ZodType) {
    return (req: ExpressReq, _res: ExpressRes, next: NextFunction) => {
      const opts = input.safeParse(req.body);
      if (!opts.success) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const errors = opts.error.flatten().fieldErrors;
        const field = Object.keys(errors)[0];
        next(
          new GenericException(
            400,
            "Invalid request body",
            `Error on field '${field}': ${errors[field][0].toLowerCase()}`
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

    const auth = this.#bfConfig.authentication;
    if (auth) {
      // -> passport.initialize()
      auth.initializers.forEach((i) => this._app.use(i));

      // -> passport strategies
      auth.strategies();
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
        res
          .status(err.statusCode)
          .json((err || InternalException()).getValues());
      }
    );
  }

  middleware() {
    //
  }

  mountRoute(method: Method, route: string, handler: RequestHandler) {
    const _route = this.#bfConfig.getRestConfig().urlPrefix + route;
    this.#router.addRoute(route); // add route to manifest
    this._app[method](_route, handler);
  }

  async start(port = this._cfg.port || DEFAULT_PORT) {
    this._cfg.port = port;
    this._handle.listen(port, () => {
      // TODO: expose flags etc...
      logger.info(`server started on: ${this.#getHost()}`);
    });
  }
}

const DEFAULT_CFG = {
  port: 6969,
  enableCors: true,
  logRequests: true,
  logAdminRequests: false,
};

export function defaultServer() {
  return new BfServer(DEFAULT_CFG);
}

export function createServer<T>(cfg: IBfServerConfig<T>) {
  return new BfServer(merge(DEFAULT_CFG, cfg));
}
