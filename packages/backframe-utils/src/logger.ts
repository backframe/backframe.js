import winston, { createLogger, format, transports } from "winston";
const { printf, colorize, combine, timestamp } = format;

const fmt = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}] - ${message}`;
});

export const logger =
  process.env.NODE_ENV === "production" ? getProdLogger() : getDevLogger();

function getDevLogger() {
  return createLogger({
    level: "debug",
    format: combine(
      colorize({ all: true }),
      timestamp({ format: "HH:mm:ss" }),
      fmt
    ),
    transports: [new transports.Console()],
  });
}

function getProdLogger() {
  return createLogger({
    level: "info",
    format: combine(timestamp(), fmt),
    transports: [
      new winston.transports.File({ filename: "bf-error.log", level: "error" }),
      new winston.transports.File({ filename: "backframe.log" }),
    ],
  });
}
