import { BfConfig, IBfConfigInternal } from "./interfaces.js";

export { loadConfig as default } from "./config.js";
export {
  BfConfig,
  BfRequestHandler,
  IBfConfigInternal,
  IHandlerContext,
  IModuleConfig,
  IResourceConfig,
  IRouteConfig,
} from "./interfaces.js";
export function defineConfig(cfg: Partial<BfConfig>) {
  return cfg;
}
export function definePlugin(cfg: Partial<IBfConfigInternal>) {
  return cfg;
}
