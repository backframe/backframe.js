import { DateTime } from "./models/datetime.js";
import { ID } from "./models/id.js";
import { Model, ModelType } from "./models/index.js";
import { Float, Int } from "./models/number.js";
import { Str } from "./models/string.js";
import { BfUserConfig } from "./utils/types.js";

export const t = {
  id: () => new ID(),
  str: () => new Str(),
  int: () => new Int(),
  float: () => new Float(),
  datetime: () => new DateTime(),
  model: (name: string, fields: { [prop: string]: ModelType }) =>
    new Model(name, fields),
};

export { BfConfig, loadConfig as default, PluginFn } from "./lib/config.js";
export {
  BfRequestHandler,
  BfResourceConfig,
  BfUserConfig,
  IBfConfigInternal,
  IBfServer,
  IHandlerContext,
  IModuleConfig,
  IResourceHandlers,
  IRouteConfig,
  MethodName,
  MethodNameAlias,
} from "./utils/types.js";
export const defineConfig = (cfg: BfUserConfig) => cfg;
