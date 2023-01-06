import { BfPluginConfig } from "@backframe/core";
import { require } from "@backframe/utils";
import { Server as SocketServer, ServerOptions } from "socket.io";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkg = require("../package.json");

export default function (options?: Partial<ServerOptions>): BfPluginConfig {
  return {
    name: pkg.name,
    description: pkg.description || "",
    onServerInit(cfg) {
      const server = cfg.$server;
      const io = new SocketServer(server.$handle, options);
      server.$sockets = io;
      cfg.$invokeListeners("onSocketsInit");
    },
  };
}

export { Event, Namespace, Socket } from "socket.io";
export { SocketServer };
