import { BfRequestHandler, IResourceConfig } from "@backframe/core";

class HandlerConfig {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(private handlers: any[]) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  handle(method: string, cfg: { input?: any; action: BfRequestHandler }) {
    this.handlers.push({
      method,
      action: cfg.action,
    });
    return this;
  }

  public getHandlers() {
    return this.handlers;
  }
}

export function defineHandlers() {
  return new HandlerConfig([]);
}

export function __parseHandlers(module: IResourceConfig) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handlers: any = {};

  module.default?.handlers.map((h) => {
    handlers[h.method] = h.action;
  });
  console.group("Handlers");
  console.log(handlers);
  console.groupEnd();
  return handlers;
}
