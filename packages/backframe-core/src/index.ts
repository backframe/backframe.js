import { BfConfig, IBfConfigInternal } from "./lib/types.js";

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
export const defineConfig = (cfg: BfConfig) => cfg;
export const definePlugin = (cfg: IBfConfigInternal) => cfg;
