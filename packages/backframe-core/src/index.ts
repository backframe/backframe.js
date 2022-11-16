import { BfUserConfig } from "./lib/util.js";
import { DateTime } from "./models/datetime.js";
import { ID } from "./models/id.js";
import { Model, ModelType } from "./models/index.js";
import { Float, Int } from "./models/number.js";
import { Str } from "./models/string.js";

export const t = {
  id: () => new ID(),
  str: () => new Str(),
  int: () => new Int(),
  float: () => new Float(),
  datetime: () => new DateTime(),
  model: (name: string, fields: { [prop: string]: ModelType }) =>
    new Model(name, fields),
};

export { BfConfig, loadConfig as default } from "./lib/config.js";
export { BfUserConfig } from "./lib/util.js";
export { Model, ModelType } from "./models/index.js";
export const defineConfig = (cfg: BfUserConfig) => cfg;
