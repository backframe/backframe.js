import { GenericException, InternalException } from "./errors";
import { ExpressReq, ExpressRes } from "./types";
/* eslint-disable quotes */
import { logger } from "@backframe/utils";
import { NextFunction } from "express";
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

export const errorHandler = () => {
  return (
    err: GenericException,
    _req: ExpressReq,
    res: ExpressRes,
    _next: NextFunction
  ) => {
    return res
      .status(err.statusCode || 500)
      .json(
        err instanceof GenericException
          ? err.toJSON()
          : err || InternalException().toJSON()
      );
  };
};
