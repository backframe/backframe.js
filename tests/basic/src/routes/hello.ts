import { createHandler, defineRouteConfig } from "@backframe/rest";
import type { Namespace } from "@backframe/sockets";

export const config = defineRouteConfig({
  securedMethods: ["get"],
});

export const listeners = (io: Namespace) => {
  io.on("connection", (socket) => {
    console.log("A user connected");
    socket.send("hello");

    socket.on("ping", (data) => console.log(data));
  });
};

export const GET = createHandler({
  action(_ctx) {
    return "Hello World!!!";
  },
});
