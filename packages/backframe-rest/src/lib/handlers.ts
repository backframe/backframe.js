import { Model } from "@backframe/core";
import {
  BfRequestHandler,
  IModuleConfig,
  IResourceHandlers,
  MethodName,
  _resolveMethod,
} from "./util.js";

export class _Handler {
  constructor(
    public method: MethodName,
    public action: BfRequestHandler,
    public middleware?: BfRequestHandler[],
    public input?: Model
  ) {}
}

export class ModuleHandlers {
  constructor(private handlers: _Handler[]) {}

  handle(
    method: MethodName,
    cfg: {
      input?: Model;
      action: BfRequestHandler;
      middleware?: BfRequestHandler[];
    }
  ) {
    this.handlers.push(
      new _Handler(method, cfg.action, cfg.middleware, cfg.input)
    );
    return this;
  }

  beforeAll(cb: BfRequestHandler) {
    this.handlers.forEach((h) => {
      if (!h.middleware?.length) h.middleware = [];
      h.middleware.unshift(cb);
    });
  }

  afterAll(cb: BfRequestHandler) {
    this.handlers.forEach((h) => {
      if (!h.middleware?.length) h.middleware = [];
      h.middleware.push(cb);
    });
  }
}

export function defineHandlers() {
  return new ModuleHandlers([]);
}

export function _parseHandlers(module: IModuleConfig, route: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const values: IResourceHandlers = {};

  const enabled = module.config?.enabled ?? getDefaultEnabled();
  // TODO: Implement dynamic handlers where model is involved
  enabled.map((method: string) => {
    values[method as MethodName] = generateHandler(method as MethodName, route);
  });

  // @ts-ignore
  const handlers = module.default?.handlers ?? [];
  handlers.map((h: _Handler) => {
    values[h.method] = h;
  });

  return values;
}

function getDefaultEnabled() {
  return ["create", "read", "update", "delete"];
}

function generateHandler(method: MethodName, route: string) {
  const m = _resolveMethod(method).toUpperCase();
  return new _Handler(
    method,
    () => ({
      status: "Okay",
      msg: `The \`${m}\` method for the \`${route}\` route is working successfully.`,
      body: `This is a default static handler. It can be overriden by defining your own handler for the \`${m}\` method or by defining a model in the config of the \`${route}\` route.`,
    }),
    []
  );
}
