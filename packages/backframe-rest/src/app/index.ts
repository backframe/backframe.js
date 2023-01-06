/* eslint-disable @typescript-eslint/ban-types */

import type { BfConfig, IBfServer } from "@backframe/core";
import { loadModule, logger, resolveCwd } from "@backframe/utils";
import cors, { CorsOptions } from "cors";
import express, { NextFunction, RequestHandler, type Express } from "express";
import fs from "fs";
import helmet from "helmet";
import http, { Server as HttpServer } from "http";
import merge from "lodash.merge";
import type { Server as SocketServer } from "socket.io";
import { ZodObject, ZodType } from "zod";
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
import { wrapHandler } from "./handlers.js";
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

export class BfServer<T> implements IBfServer<T> {
  $app: Express;
  $handle: HttpServer;
  $database?: T;
  $sockets?: SocketServer;

  #router: Router;
  #bfConfig!: BfConfig;
  #resources!: Resource<unknown>[];
  #middleware: Handler<T, {}>[];

  constructor(public $cfg: IBfServerConfig<T>) {
    this.$app = express();
    this.$database = $cfg.database;
    this.$handle = http.createServer(this.$app);

    this.#middleware = [];
    this.#resources = [];
  }

  // Initializes the server and returns a promise that resolves when the server is ready
  async $init(cfg: BfConfig) {
    cfg.$setServer(this);
    cfg.$invokeListeners("onServerInit");

    this.#bfConfig = cfg;
    this.#router = new Router(cfg);
    this.#router.init();
    this.#applyMiddleware();

    await this.#loadResources();
    this.#setupErrHandlers(); // ensure called last
  }

  #validatePort(port: number) {
    // range
    if (port < 0 || port > 65535) {
      logger.error(`Invalid port: ${port}`);
      process.exit(10);
    }
    // check if port is in use
    try {
      fs.accessSync(`http://localhost:${port}`);
      logger.error(`Port ${port} is in use`);
      process.exit(11);
    } catch (e) {
      // port is free
    }
  }

  // Starts the server on provided port or default port
  async $start(port = this.$cfg.port || DEFAULT_PORT) {
    this.#validatePort(port);
    this.$cfg.port = port;
    this.$handle.listen(port, () => {
      logger.info(`server started on: ${this.$getHost()}`);
      this.#bfConfig.$invokeListeners("onServerStart");
    });
  }

  // TODO: expose flags etc...
  $getHost(port = this.$cfg.port || DEFAULT_PORT) {
    return `http://localhost:${port}`;
  }

  // where the magic happens
  async #loadResources() {
    // load root server listeners
    const entry = this.#bfConfig.getAbsDirPath("entryPoint");
    const module = await loadModule(entry);

    if (module.listeners && this.$sockets) {
      module.listeners(this.$sockets); // pass io object
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
          if (!this.$sockets) {
            logger.warn(
              `listeners found in route: \`${r.route}\` but sockets plugin not enabled`
            );
          } else {
            const nsp = this.$sockets.of(r.route);
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

                return value;
              } catch (error) {
                // eslint-disable-next-line no-console
                console.log(error);
                ctx.json({ msg: "An internal error occurred" });
              }
            },
          ]
            .filter((h) => typeof h !== "undefined")
            .map((h) => wrapHandler(h, this.$database));

          // add validator (should be `unshifted` last... First line of defense)
          if (input) {
            handlers.unshift(this.#validator(input));
          }

          // mount resource on express app
          this.$app[method](r.route, handlers);
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
    const bfCfg = this.#bfConfig;

    this.$app.use(helmet());
    this.$app.use(express.json({ limit: "20mb" }));
    this.$app.use(express.urlencoded({ extended: true }));

    const useCors = this.$cfg.enableCors;
    const log = this.$cfg.logRequests;
    const logAdmin = this.$cfg.logAdminRequests;

    useCors && this.$app.use(cors(this.$cfg.corsOptions));
    if (log) {
      this.$app.use((req, res, next) => {
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

    // additional "middleware" i.e staticDir handlers
    const staticDirs = bfCfg.getDirPath("staticDirs");
    staticDirs.forEach((dir) => {
      const p = resolveCwd(dir);
      if (fs.existsSync(p)) {
        logger.info(`serving stating assets from dir: ${dir}`);
        this.$app.use(express.static(p));
      }
    });

    // configure default templating setup
    const viewsDir = bfCfg.getDirPath("viewsDir");
    if (fs.existsSync(resolveCwd(viewsDir))) {
      logger.info(`loading views from dir: ${viewsDir}`);
      this.$app.set("view engine", "hbs");
      this.$app.set("views", viewsDir);
    }
  }

  #setupErrHandlers() {
    // at this point, no route has been found
    this.$app.use("*", (req, _res, _next) => {
      if (this.#resources.some((r) => r.route === req.originalUrl))
        throw MethodNotAllowed(
          "Method Not Allowed",
          `The \`${req.method}\` method is not allowed on this resource`
        );
      throw NotFoundExeption();
    });

    this.$app.use(
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

  /**
   * This method is used to define global middleware. Handlers defined here will be executed on every request to the server.
   * @param handler - The handler to be executed on every request
   * @example
   * ```ts
   * server.use((ctx) => {
   *  // do something
   * })
   * ```
   * @example
   * ```ts
   * server.use(async (ctx) => {
   *  // do something
   * })
   * ```
   */
  use(handler: Handler<T, {}>) {
    this.$app.use(wrapHandler(handler));
  }

  /**
   * Use this method to define a static directory. This is a wrapper around the `express.static` method. Static dirs can also be defined in the `staticDirs` property of the `bf.config.js` file. Use this method if you want to define a static dir with a custom prefix.
   * @param p - The prefix to be used for the static dir
   * @param path - The path to the static dir
   * @example
   * ```ts
   * server.static("/static", "./public")
   * ```
   */
  static(p: string, path: string) {
    this.$app.use(this.#bfConfig.withRestPrefix(p), express.static(path));
  }

  /**
   * Backframe uses fs-based routing but you can also used this method to define custom routes. This method is  provided for convenience when creating custom routes in backframe plugins. Handlers defined here will be added to the router manifest and prefixed with the `restPrefix` defined in the `bf.config.js` file.
   * @param method - The HTTP method to be used for the route
   * @param route - The route to be defined
   * @param handler - The handler to be executed when the route is called
   * @example
   * ```ts
   * server.mountRoute("get", "/hello", (ctx) => {
   *    ctx.res.send("hello world")
   * })
   * ```
   */
  mountRoute(method: Method, route: string, handler: RequestHandler) {
    this.#router.addRoute(route); // add route to manifest
    this.$app[method](this.#bfConfig.withRestPrefix(route), handler);
  }
}

const DEFAULT_CFG = {
  port: 6969,
  enableCors: true,
  logRequests: true,
  logAdminRequests: false,
};

/**
 * Creates a new server instance with the default configuration
 * @returns `BfServer`
 * @example
 * ```ts
 * import { defaultServer } from "@backframe/rest"
 * const server = defaultServer()
 *
 * export default server
 * ```
 */
export function defaultServer() {
  return new BfServer(DEFAULT_CFG);
}

/**
 * Creates a new server instance with the provided configuration
 * @param cfg - The configuration to be used for the server
 * @returns `BfServer`
 * @example
 * ```ts
 * import { createServer } from "@backframe/rest"
 * const server = createServer({
 *    port: 6969,
 *    enableCors: true,
 *    logRequests: true,
 *    logAdminRequests: false,
 * })
 *
 * export default server
 * ```
 */
export function createServer<T>(cfg: IBfServerConfig<T>) {
  return new BfServer(merge(DEFAULT_CFG, cfg));
}
