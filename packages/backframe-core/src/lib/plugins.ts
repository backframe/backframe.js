import { BfConfig } from "./config.js";

export type PluginFn = (cfg: BfConfig) => BfConfig | void;
export type Listener =
  | "authClient"
  | "databaseClient"
  | "afterLoadConfig"
  | "overrideBuilder"
  | "storageProvider"
  | "beforeServerStart";

export class PluginsConfig {
  constructor(
    private listeners: {
      authClient: PluginFn[];
      databaseClient: PluginFn[];
      afterLoadConfig: PluginFn[];
      overrideBuilder: PluginFn[];
      storageProvider: PluginFn[];
      beforeServerStart: PluginFn[];
    }
  ) {}

  invokePlugins(key: Listener, cfg: BfConfig) {
    const plugins = this.listeners[key];
    plugins.forEach((p) => {
      p(cfg);
    });
    return cfg;
  }

  includesPlugins(key: Listener): boolean {
    const listeners = this.listeners ?? {};
    const keys = Object.keys(listeners[key]) ?? [];
    return keys.length > 0;
  }

  registerPlugin(key: Listener, plugin: PluginFn) {
    this.listeners[key].push(plugin);
  }
}

export class Plugin {
  constructor(
    private listeners: {
      [key: string]: PluginFn;
    }
  ) {}

  register(key: Listener, cb: PluginFn) {
    this.listeners[key] = cb;
  }
}

export function definePlugin() {
  return new Plugin({});
}
