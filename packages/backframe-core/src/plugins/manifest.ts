import { logger } from "@backframe/utils";
import { BfConfig, PluginKey } from "../config/index.js";
import { BfPluginConfig } from "./index.js";

// don't add modifyServer here, multiple values are allowed for it
export const PluginTypes = ["emailProvider", "storageProvider", "compiler"];

export class PluginManifest {
  #plugins: BfPluginConfig[];

  constructor(private cfg: BfConfig) {
    this.#plugins = [];
  }

  register(p: BfPluginConfig) {
    this.inspect(p);
    this.#plugins.push(p);
    const { modifyServer, ...others } = p;

    // add server modifiers
    this.cfg.__addServerModifier(modifyServer ?? null);

    // other keys
    Object.keys(others).forEach((k) => {
      if (PluginTypes.includes(k)) {
        // tis a listener
        const listener = others[k as PluginKey];
        this.cfg[k as PluginKey] = listener;
      }
    });
  }

  inspect(p: BfPluginConfig) {
    // iterate through keys
    Object.keys(p).forEach((key) => {
      if (PluginTypes.includes(key)) {
        // check conflict
        const conflict = this.#plugins.find(($) => $[key as PluginKey]);
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
