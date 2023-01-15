import {
  createHandler,
  defineRouteConfig,
  ForbiddenException,
  z,
} from "@backframe/rest";
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
  async action(_ctx) {
    return ForbiddenException();
    // return "Hello World!!!";
  },
});

export const POST = createHandler({
  input: z.object({
    name: z.string(),
  }),
  action(_ctx) {
    console.log(_ctx.input);
    return "Hello World!!!";
  },
});
