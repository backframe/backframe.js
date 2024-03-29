import { logger } from "@backframe/utils";
import { NextFunction, RequestHandler } from "express";
import http from "http";
import { ZodError, ZodObject, ZodRawShape, z } from "zod";
import { GenericException } from "./errors.js";
import { ExpressReq, ExpressRes } from "./types.js";

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

export function createExpressRequestValidator<T extends ZodRawShape>({
  schema,
  source,
  errorTitle,
  errorMsgPrefix,
}: {
  schema: ZodObject<T>;
  source?: "body" | "query" | "params";
  errorTitle: string;
  errorMsgPrefix?: string;
}): RequestHandler {
  return (req: ExpressReq, _res: ExpressRes, next: NextFunction) => {
    const opts = schema.safeParse(req[source]);
    if (opts.success === false) {
      const errors: Record<string, string[]> = opts.error.flatten().fieldErrors;
      const field = Object.keys(errors)[0];
      next(
        new GenericException(
          400,
          errorTitle,
          `${`${errorMsgPrefix} ` || ""}'${field}': ${errors[
            field
          ][0].toLowerCase()}`
        )
      );
    } else {
      req[source] = opts.data;
      next();
    }
  };
}

export function validate<T extends ZodRawShape>({
  schema,
  input,
  onValidationError,
}: {
  schema: ZodObject<T>;
  input: unknown;
  onValidationError?: (error: ZodError) => void;
  onValidationSuccess?: (data: z.infer<ZodObject<T>>) => void;
}) {
  const result = schema.safeParse(input);

  if (result.success === true) {
    return result.data;
  } else {
    if (onValidationError) {
      return onValidationError(result.error);
    } else {
      console.error(
        "❌ Schema validation failed:",
        result.error.flatten().fieldErrors
      );
      throw new Error("Schema validation failed");
    }
  }
}
