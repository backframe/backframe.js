import { createServer } from "@backframe/rest";
import { SocketServer } from "@backframe/sockets";
import { PrismaClient } from "database";

export const prisma = new PrismaClient();

export type DB = typeof prisma;

const server = createServer({
  database: prisma,
});

// listen for db events

export const listeners = (io: SocketServer) => {
  io.on("connection", (_sock) => {
    //
  });
};

export default server;
