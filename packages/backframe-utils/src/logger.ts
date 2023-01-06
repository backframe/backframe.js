import winston, { createLogger, format, transports } from "winston";
const { printf, colorize, combine, timestamp } = format;

export const Logger =
  process.env.NODE_ENV === "production" ? getProdLogger() : getDevLogger();

function _log(
  msg: string,
  level: "info" | "http" | "error" | "warn" | "debug"
) {
  if (process.env.BF_SILENT_LOG !== "true") Logger[level](msg);
}

export const info = (msg: string) => _log(msg, "info");
export const debug = (msg: string) => _log(msg, "debug");
export const warn = (msg: string) => _log(msg, "warn");
export const http = (msg: string) => _log(msg, "http");
export const error = (msg: string) => _log(msg, "error");
export const log = (level: string, msg: string) => Logger.log(level, msg);

const fmt = printf(({ level, message, timestamp }) => {
  return `[${timestamp}] ${level} - ${message}`;
});

function getDevLogger() {
  const fmt = printf(({ level, message, timestamp }) => {
    return `[${timestamp}] ${getPadding(level)} -  ${message}`;
  });
  return createLogger({
    level: process.env.BF_LOG_LEVEL || "debug",
    format: combine(
      colorize({ all: true }),
      timestamp({ format: "YY-MM-DD HH:mm:ss" }),
      fmt
    ),
    transports: [new transports.Console()],
  });
}

function getProdLogger() {
  return createLogger({
    level: process.env.BF_LOG_LEVEL || "info",
    format: combine(timestamp(), fmt),
    transports: [
      new winston.transports.File({ filename: "bf-error.log", level: "error" }),
      new winston.transports.File({ filename: "backframe.log" }),
    ],
  });
}

function getPadding(val: string) {
  const max = 15;
  const diff = max - val.length;

  for (let i = diff; i > 0; i--) {
    val += " ";
  }

  return val;
}
