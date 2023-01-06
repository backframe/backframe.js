/* eslint-disable @typescript-eslint/ban-types */

import type { BfConfig, IBfServer } from "@backframe/core";
import { loadModule, logger, resolveCwd } from "@backframe/utils";
import cors, { CorsOptions } from "cors";
import express, { NextFunction, RequestHandler, type Express } from "express";
import fs from "fs";
import helmet from "helmet";
import http, { Server as HttpServer, ServerResponse } from "http";
import merge from "lodash.merge";
import path from "path";
import type { Server as SocketServer } from "socket.io";
import { ZodObject, ZodRawShape, ZodType } from "zod";
import {
  GenericException,
  InternalException,
  MethodNotAllowed,
  NotFoundExeption,
} from "../lib/errors.js";
import {
  ExpressReq,
  ExpressRes,
  Handler,
  IHandlerConfig,
  Method,
} from "../lib/types.js";
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

export const isText = (v: unknown) => {
  return (
    typeof v === "bigint" ||
    typeof v === "boolean" ||
    typeof v === "number" ||
    typeof v === "string"
  );
};

export class BfServer<T> implements IBfServer<T> {
  _app: Express;
  _handle: HttpServer;
  _database?: T;
  _sockets?: SocketServer;

  #router: Router;
  #bfConfig!: BfConfig;
  #resources!: Resource<unknown>[];
  #middleware: Handler<T, {}>[];

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
    cfg.__invokeServerModifiers();

    await this.#loadResources();
    this.#setupErrHandlers(); // ensure called last
  }

  #getHost(port = this._cfg.port || DEFAULT_PORT) {
    return `http://localhost:${port}`;
  }

  #wrapHandler<Z extends ZodRawShape>(handler: Handler<T, Z>) {
    return async (req: ExpressReq, res: ExpressRes, next: NextFunction) => {
      const ctx =
        (req.sharedCtx as Context<T, ZodObject<Z>>) ??
        new Context<T, ZodObject<Z>>(
          req,
          res,
          next,
          this.#bfConfig,
          this._database
        );
      // plant ctx in req object for reuse
      req.sharedCtx = ctx;
      const value = await handler(ctx);

      if (value instanceof GenericException)
        return next(value); // forward error
      else if (value instanceof ServerResponse) return; // response already sent
      else if (isText(value) || typeof value === "object") {
        // return plain values
        return res.status(200).send(value);
      }
    };
  }

  async #loadResources() {
    // load root server listeners
    const entry = this.#bfConfig.getEntryPoint();
    const module = await loadModule(entry);

    if (module.listeners && this._sockets) {
      module.listeners(this._sockets); // pass io object
    }

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

        // check for realtime listeners
        if (r.listeners) {
          if (!this._sockets) {
            logger.warn(
              `listeners found in route: \`${r.route}\` but sockets plugin not enabled`
            );
          } else {
            const nsp = this._sockets.of(r.route);
            r.listeners(nsp);
          }
        }

        // check for rest methods handlers
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

          // check for before and after handler hooks
          const { beforeAll, afterAll } = r;
          const handlers: T[] = [
            beforeAll,
            ...globalMware,
            ...(middleware ?? []),
            async function <T, U extends ZodObject<{}>>(ctx: Context<T, U>) {
              try {
                const value = await action(ctx);
                afterAll?.(ctx); // dont await

                if (value instanceof GenericException)
                  return ctx.next(value); // forward error
                else if (value instanceof ServerResponse)
                  return; // response already sent
                else if (isText(value) || typeof value === "object") {
                  // return plain values
                  return ctx.json(value as object);
                }
              } catch (error) {
                // eslint-disable-next-line no-console
                console.log(error);
                ctx.json({ msg: "An internal error occurred" });
              }
            },
          ]
            .filter((h) => typeof h !== "undefined")
            .map((h) => this.#wrapHandler(h));

          // add validator (should be `unshifted` last... First line of defense)
          if (input) {
            handlers.unshift(this.#validator(input));
          }

          // mount resource on express app
          this._app[method](r.route, handlers);
        });
      })
    );
  }

  #validator(input: ZodType) {
    // TODO: input sanitization
    return (req: ExpressReq, _res: ExpressRes, next: NextFunction) => {
      const opts = input.safeParse(req.body);
      if (!opts.success) {
        // @ts-expect-error (value exists)
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

    const fullDir = (dir: string) =>
      path.join(this.#bfConfig.getRootDirName(), dir);

    // additional "middleware" i.e staticDir handlers
    const staticDirs = this.#bfConfig.userCfg.staticDirs;
    staticDirs.forEach((dir) => {
      const p = resolveCwd(fullDir(dir));
      if (fs.existsSync(p)) {
        logger.info(`serving stating assets from dir: ${dir}`);
        this._app.use(express.static(p));
      }
    });

    // configure default templating setup
    const { viewsDir } = this.#bfConfig.userCfg;
    if (fs.existsSync(resolveCwd(fullDir(viewsDir)))) {
      logger.info(`loading views from dir: ${viewsDir}`);
      this._app.set("view engine", "hbs");
      this._app.set("views", fullDir(viewsDir));
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

  middleware(handler: Handler<T, {}>) {
    this._app.use(this.#wrapHandler(handler));
  }

  static(prefix: string, path: string) {
    const _route = this.#bfConfig.getRestConfig().urlPrefix + prefix;
    this._app.use(_route, express.static(path));
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
