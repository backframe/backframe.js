import { BfConfig } from "./lib/types.js";

export { loadConfig as default } from "./lib/config.js";
export {
  BfConfig,
  BfRequestHandler,
  BfResourceConfig,
  IBfConfigInternal,
  IBfServer,
  IHandlerContext,
  IModuleConfig,
  IResourceHandlers,
  IRouteConfig,
  MethodName,
  MethodNameAlias,
} from "./lib/types.js";
export { definePlugin } from "./lib/utils.js";
export const defineConfig = (cfg: BfConfig) => cfg;
