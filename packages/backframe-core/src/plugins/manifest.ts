import { logger } from "@backframe/utils";
import { BfConfig, PluginKey } from "../config/index.js";
import { BfPluginConfig } from "./index.js";

export const PluginTypes = ["emailProvider", "storageProvider", "compiler"];

export class PluginManifest {
  #plugins: BfPluginConfig[];

  constructor(private cfg: BfConfig) {
    this.#plugins = [];
  }

  register(p: BfPluginConfig) {
    this.#plugins.push(p);
    const { modifyServer, ...others } = p;

    // add server modifiers
    this.cfg.__addServerModifier(modifyServer ?? null);

    // other keys
    Object.keys(others).forEach((k) => {
      if (PluginTypes.includes(k)) {
        // tis a listener
        const listener = others[k as PluginKey];

        // already included
        if (this.cfg[k as PluginKey]) {
          const name =
            p.name ?? `unknown-plugin-${Math.round(Math.random() * 100000)}`;
          logger.error("conflicting plugins found");
          logger.error(
            `plugin: \`${name}\` tried to modify the \`${k}\` which is already set`
          );
          process.exit(1);
        } else {
          this.cfg[k as PluginKey] = listener;
        }
      }
    });
  }
}
