import { createServer } from "@backframe/rest";

const server = createServer({
  port: 8989,
});

server.start();
