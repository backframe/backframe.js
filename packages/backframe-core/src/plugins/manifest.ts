import { logger } from "@backframe/utils";
import {
  BfConfig,
  ConfigKey,
  Listener,
  LISTENERS_LIST,
  PLUGINS_LIST,
} from "../config/index.js";
import { Plugin } from "./index.js";

export class PluginManifest {
  #plugins: Plugin[];

  constructor(private cfg: BfConfig) {
    this.#plugins = [];
  }

  register(p: Plugin) {
    this.#inspect(p);
    this.#plugins.push(p);
    const { ...keys } = p;

    // can either be a `plugin` or a `listener`
    Object.keys(keys).forEach((key) => {
      if (LISTENERS_LIST.includes(key as Listener)) {
        // tis a listener
        const listener = keys[key as Listener];
        this.cfg.$addListener(key as Listener, listener);
      } else {
        // tis a plugin
        const plugin = keys[key as ConfigKey];
        this.cfg.$addPlugin(key as ConfigKey, plugin);
      }
    });
  }

  #inspect(p: Plugin) {
    // iterate through keys
    Object.keys(p).forEach((key) => {
      if (PLUGINS_LIST.includes(key as ConfigKey)) {
        // check conflict
        const conflict = this.#plugins.find(($) => $[key as ConfigKey]);
        if (conflict) {
          const rand = () =>
            `unknown-plugin-${Math.round(Math.random() * 100000)}`;
          const n1 = conflict.name || rand();
          const n2 = p.name || rand();

          logger.warn(`conflicting plugins: \`${n1}\` and \`${n2}\` found`);
          logger.warn(`both plugins are modifying the \`${key}\``);
          logger.warn("this might cause unexpected behaviour");
        }
      }
    });
  }
}
