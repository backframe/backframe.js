import { IHandlerContext, IRouteConfig } from "@backframe/core";

const defaultHandler = (ctx: IHandlerContext) => {
  ctx.res.status(200).json({
    status: "Success",
    msg: "Basic route functionality working",
    body: "This is a default static route handler. You can either define a model for this route or override the specific handler to add functionality.",
  });
};

export function _generateHandlers(module: IRouteConfig) {
  if (module.config?.model) {
    return _dynamicHandlers(module);
  }
  return _staticHandlers(module);
}

function _staticHandlers(module: IRouteConfig) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handlers: any = {};
  module.config?.enabledMethods?.map((m) => {
    handlers[m] = defaultHandler;
  });
  return handlers;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function _dynamicHandlers(_module: IRouteConfig) {
  return {
    get: defaultHandler,
    post: defaultHandler,
  };
}
