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
  authentication: z
    .object({
      type: z.enum(["token-based", "session-based"]).default("token-based"),
      providers: z
        .array(
          z.object({
            provider: z.string(),
            config: z.any(),
          })
        )
        .optional(),
    })
    .optional(),
  settings: z.object({
    srcDir: z.string().optional().default("src"),
    staticDir: z.string().optional().default("static"),
    viewsDir: z.string().optional().default("views"),
    entryPoint: z.string().optional().default("server.js"),
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
