import dotenv from "dotenv";
import { globbySync } from "globby";
import { ZodError, ZodSchema, z } from "zod";
import { logger } from "./index.js";

export function setEnv(env: string) {
  process.env.NODE_ENV = env;
}

export function env(key: string, defaultValue?: string) {
  loadEnv();
  return process.env[key] ?? defaultValue;
}

export function loadEnv(silent = true) {
  globbySync(".env*")
    .filter((f) => !f.includes(".example"))
    .forEach((file) => {
      dotenv.config({ path: file });
      !silent && logger.info(`loaded env vars from ${file}`);
    });
}

type EnvValidatorArgs<T extends ZodSchema> = {
  schema: T;
  runtimeEnv?: object;
  onValidationError?: (error: ZodError) => void;
  skipValidation?: boolean;
};

export function createEnvValidator<T extends ZodSchema>({
  schema,
  runtimeEnv = process.env,
  onValidationError,
  skipValidation,
}: EnvValidatorArgs<T>): z.infer<T> {
  if (skipValidation) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return runtimeEnv as any;
  }

  const error =
    onValidationError ??
    ((error: ZodError) => {
      console.error(
        "❌ Invalid environment variables:",
        error.flatten().fieldErrors
      );
      throw new Error("Invalid environment variables");
    });

  const parsed = schema.safeParse(runtimeEnv);
  if (parsed.success === false) {
    return error(parsed.error);
  }

  return parsed.data;
}

export function createLazyEnvValidator<T extends ZodSchema>(
  args: EnvValidatorArgs<T>
): z.infer<T> {
  return {
    validate: () => createEnvValidator(args),
  };
}
