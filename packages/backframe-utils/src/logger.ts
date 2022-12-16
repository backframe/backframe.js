import winston, { createLogger, format, transports } from "winston";
const { printf, colorize, combine, timestamp } = format;

const fmt = printf(({ level, message, timestamp }) => {
  return `[${timestamp}] ${level} - ${message}`;
});

export const logger =
  process.env.NODE_ENV === "production" ? getProdLogger() : getDevLogger();

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
