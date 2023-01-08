import { Plugin } from "@backframe/core";
import { Server as SocketServer, ServerOptions } from "socket.io";

export default function (options?: Partial<ServerOptions>): Plugin {
  return {
    name: "@backframe/sockets",
    description: "Adds socket.io support to your backframe app",
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
