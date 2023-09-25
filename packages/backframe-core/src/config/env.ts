import { ZodError, ZodObject, ZodRawShape, z } from "zod";

type EnvValidatorArgs<T extends ZodRawShape> = {
  schema: ZodObject<T>;
  runtimeEnv?: object;
  onValidationError?: (error: ZodError) => void;
  skipValidation?: boolean;
};

export function createEnvValidator<T extends ZodRawShape>({
  schema,
  runtimeEnv = process.env,
  onValidationError,
  skipValidation,
}: EnvValidatorArgs<T>): z.infer<ZodObject<T>> {
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
    throw error(parsed.error);
  }

  return parsed.data;
}

export function createLazyEnvValidator<T extends ZodRawShape>(
  args: EnvValidatorArgs<T>
) {
  return {
    validate: () => createEnvValidator(args),
  };
}
