/* eslint-disable @typescript-eslint/ban-types */

import type { BfConfig, IBfServer } from "@backframe/core";
import type { DB } from "@backframe/models";
import { loadModule, logger, resolveCwd } from "@backframe/utils";
import cors, { CorsOptions } from "cors";
import express, { NextFunction, RequestHandler, type Express } from "express";
import fs from "fs";
import helmet from "helmet";
import http, { Server as HttpServer } from "http";
import merge from "lodash.merge";
import type { Server as SocketServer } from "socket.io";
import { ZodObject, ZodRawShape } from "zod";
import {
  GenericException,
  MethodNotAllowed,
  NotFoundExeption,
} from "../lib/errors.js";
import { errorHandler, httpLogger } from "../lib/middleware.js";
import {
  BfHandler,
  ExpressReq,
  ExpressRes,
  IHandlerConfig,
  Method,
} from "../lib/types.js";
import { validatePort } from "../lib/utils.js";
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

export class BfServer<T extends DB> implements IBfServer<T> {
  $app: Express;
  $handle: HttpServer;
  $database?: T;
  $sockets?: SocketServer;

  #router: Router;
  #bfConfig!: BfConfig;
  $resources!: Resource<unknown>[];
  $middleware: BfHandler[];

  constructor(public $cfg: IBfServerConfig<T>) {
    this.$app = express();
    this.$database = $cfg.database;
    this.$handle = http.createServer(this.$app);

    this.$middleware = [];
    this.$resources = [];
  }

  // Initializes the server and returns a promise that resolves when the server is ready
  async $init(cfg: BfConfig) {
    cfg.$setServer(this);
    this.#bfConfig = cfg;

    this.#router = new Router(cfg);
    cfg.$invokeListeners("onServerInit"); // listeners may declare routes
    this.#router.init();
    this.#applyMiddleware();

    await this.#loadResources();
    this.#setupErrHandlers(); // ensure called last
  }

  // Starts the server on provided port or default port
  async $start(port = this.$cfg.port) {
    port = await validatePort(port);
    this.$cfg.port = port;

    this.$handle.listen(port, () => {
      logger.info(`server started on: ${this.$getHost()}`);
      this.#bfConfig.$invokeListeners("onServerStart");
    });
  }

  // TODO: expose flags etc...
  $getHost(port = this.$cfg.port) {
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
      // not a dummy route
      if (i.filePath !== null) {
        const r = new Resource(i, this.#bfConfig);
        if (!this.$resources.some((_) => _.route === r.route))
          this.$resources.push(r);
      }
    });

    // init all resources
    return Promise.all(
      this.$resources.map(async (r) => {
        await r.initialize();
        const handlers = r.handlers ?? {};
        const globalMware = this.$middleware?.concat(r.middleware ?? []);

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
          const { action, input, middleware } = r.handlers[
            method as Method
          ] as IHandlerConfig<{}, {}>;

          // check for before and after handler hooks
          const { beforeAll, afterAll } = r;
          const handlers = [
            beforeAll,
            ...globalMware,
            ...(middleware ?? []),
            async function <U extends ZodObject<{}>>(ctx: Context<U>) {
              try {
                const value = await action(ctx);
                afterAll?.(ctx); // dont await

                return value;
              } catch (error) {
                // eslint-disable-next-line no-console
                console.log(error);
                ctx.json({ msg: "An internal error occurred" });
                return null;
              }
            },
          ]
            .filter((h) => typeof h !== "undefined")
            .map((h) => wrapHandler(h, this.#bfConfig));

          // add validator (should be `unshifted` last... First line of defense)
          if (input) {
            handlers.unshift(this.$createValidator(input));
          }

          // mount resource on express app
          this.$app[method](r.route, handlers);
        });
      })
    );
  }

  $createValidator<T extends ZodRawShape>(input: ZodObject<T>): RequestHandler {
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
        // sanitize input
        const sanitized: Record<string, unknown> = {};
        Object.keys(input.shape).forEach((k) => {
          // @ts-expect-error (value exists)
          sanitized[k] = opts.data[k];
        });
        req.body = sanitized;
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
    const logAdmin = this.$cfg.logAdminRequests;

    useCors && this.$app.use(cors(this.$cfg.corsOptions));
    this.$app.use(httpLogger({ logAdmin }));

    // additional "middleware" i.e staticDir handlers
    const staticDirs = bfCfg.getDirPath("staticDirs");
    staticDirs.forEach((dir) => {
      const p = resolveCwd(dir);
      if (fs.existsSync(p)) {
        logger.info(`serving stating assets from dir: ${dir}`);
        this.$app.use(express.static(p));
      }
    });

    // TODO: configure default templating setup
  }

  #setupErrHandlers() {
    // at this point, no route has been found
    this.$app.use("*", (req) => {
      if (
        this.$resources.some(
          (r) => this.#bfConfig.withRestPrefix(r.route) === req.originalUrl
        )
      )
        throw MethodNotAllowed(
          "Method Not Allowed",
          `The \`${req.method}\` method is not allowed on this resource`
        );
      throw NotFoundExeption();
    });

    this.$app.use(errorHandler());
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
  use(handler: BfHandler) {
    this.$app.use(wrapHandler(handler, this.#bfConfig));
  }

  /**
   * Use this method to define a static directory. This is a wrapper around the `express.static` method. Static dirs can also be defined in the `staticDirs` property of the `bf.config.js` file. Use this method if you want to define a static dir with a custom prefix.
   * @param prefix - The prefix to be used for the static dir
   * @param path - The path to the static dir
   * @example
   * ```ts
   * server.static("/static", "./public")
   * ```
   */
  static(prefix: string, path: string) {
    this.$app.use(this.#bfConfig.withRestPrefix(prefix), express.static(path));
  }

  /**
   * Backframe uses fs-based routing but you can also used this method to define custom routes. This method is  provided for convenience when creating custom routes in backframe plugins. Handlers defined here will be added to the router manifest and prefixed with the `restPrefix` defined in the `bf.config.js` file.
   * @param method - The HTTP method to be used for the route
   * @param route - The route to be defined
   * @param handler - The handler to be executed when the route is called
   * @param origin (optional) - Conventionally, this would be the name of the plugin mounting the route
   * @example
   * ```ts
   * server.mountRoute("get", "/hello", (ctx) => {
   *    ctx.res.send("hello world")
   * })
   * ```
   */
  $mountRoute(
    method: Method,
    route: string,
    handler: RequestHandler | RequestHandler[],
    origin?: string
  ) {
    this.#router.addRoute(route, origin); // add route to manifest
    this.$app[method](this.#bfConfig.withRestPrefix(route), handler);
  }

  $extendFrom(path: string, cfg: { name?: string; prefix?: string }) {
    const sub = new Router(this.#bfConfig, cfg); // sub-router
    sub.init(path, "routes");
    this.#router.mergeRouter(sub);
  }

  $listRoutes() {
    const { manifest } = this.#router;
    return manifest.getRoutesMeta();
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
export function createServer<T extends DB>(cfg: IBfServerConfig<T>) {
  return new BfServer(merge(DEFAULT_CFG, cfg));
}
