import { IModuleConfig, Methods } from "@backframe/core";
import { BfRequestHandler } from "./resources.js";

export class Handler {
  constructor(
    public method: Methods,
    public action: BfRequestHandler,
    public middleware: BfRequestHandler[],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public input?: any
  ) {}
}

class HandlersConfig {
  constructor(private handlers: Handler[]) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handle(method: Methods, cfg: { input?: any; action: BfRequestHandler }) {
    this.handlers.push(new Handler(method, cfg.action, cfg.input));
    return this;
  }
}

export function defineHandlers() {
  return new HandlersConfig([]);
}

export function _parseHandlers(module: IModuleConfig, route: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const values: any = {};
  const handlers = module.default?.handlers ?? [];

  // @ts-ignore
  handlers.map((h: Handler) => {
    values[h.method] = h;
  });

  if (!Object.keys(values).length) {
    // generate default handlers for enabled methods
    const enabled = module.config?.enabled ?? getDefaultEnabled();

    // TODO: Implement dynamic handlers where model is involved
    enabled.map((method: string) => {
      values[method] = generateHandler(method, route);
    });
  }

  return values;
}

function getDefaultEnabled() {
  return ["create", "read", "update", "delete"];
}

function generateHandler(method: string, route: string) {
  return () => ({
    status: "Okay",
    msg: `The "${method}" method for the \`${route}\` route is working successfully.`,
    body: `This is a default static handler. It can be overriden by defining your own handler for the "${method}" method or by defining a model in the config of the \`${route}\` route.`,
  });
}
