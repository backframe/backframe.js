import { z } from "zod";

export const BfConfigSchema = z.object({
  interfaces: z
    .object({
      rest: z
        .object({
          versioned: z.boolean().optional(),
          urlPrefix: z.string().optional(),
        })
        .optional(),
      graphql: z
        .object({
          mount: z.string().optional(),
        })
        .optional(),
    })
    .optional(),
  plugins: z
    .array(
      z
        .object({
          resolve: z.string(),
          options: z.any(),
        })
        .or(z.string())
    )
    .optional(),
  providers: z
    .array(
      z.object({
        provider: z.string(),
        config: z.any(),
      })
    )
    .optional(),
  settings: z.object({
    srcDir: z.string().optional(),
    staticDir: z.string().optional(),
    viewsDir: z.string().optional(),
    entryPoint: z.string().optional(),
  }),
});

export type BfUserConfig = z.infer<typeof BfConfigSchema>;

export function generateDefaultConfig(): BfUserConfig {
  return {
    settings: {
      srcDir: "src",
      entryPoint: "server.js",
      staticDir: "static",
      viewsDir: "views",
    },
  };
}
