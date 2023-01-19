import { logger } from "@backframe/utils";
import http from "http";

export function isPortFree(port: number) {
  return new Promise<boolean>((resolve) => {
    const server = http
      .createServer()
      .listen(port, () => {
        server.close();
        resolve(true);
      })
      .on("error", () => {
        resolve(false);
      });
  });
}

export async function validatePort(port: number, iter = 1): Promise<number> {
  let p = port;
  // range
  if (!(65536 > port && port > 0)) {
    logger.error(`received invalid port: ${port}`);
    process.exit(10);
  }
  // check if port is in use
  const valid = await isPortFree(port);
  if (!valid) {
    p = port + 5 * iter;
    logger.warn(`port: ${port} is in use, trying: ${p}`);
    return validatePort(p, iter + 1);
  }

  return p;
}
