import { createServer } from "@backframe/rest";
import { SocketServer } from "@backframe/sockets";
import { PrismaClient } from "database";

export const prisma = new PrismaClient();

export type DB = typeof prisma;

const server = createServer({
  port: 8989,
  database: prisma,
});

export const listeners = (io: SocketServer) => {
  io.on("connection", (_sock) => {
    //
  });
};

export default server;
