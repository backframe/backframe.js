/* eslint-disable quotes */
import { logger } from "@backframe/utils";
import morgan from "morgan";

export const httpLogger = ({ logAdmin }: { logAdmin: boolean }) => {
  const fmt =
    process.env.NODE_ENV === "PRODUCTION"
      ? ':remote-addr - :remote-user ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"'
      : ":method :url HTTP/:http-version -> :status in :response-time ms";

  return morgan(fmt, {
    stream: {
      write(msg) {
        logger.http(msg.replace(/\n/g, ""));
      },
    },
    skip(req, _res) {
      if (req.url.includes("/__/") && !logAdmin) return true;
      return false;
    },
  });
};
