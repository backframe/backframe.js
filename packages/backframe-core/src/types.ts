import { z } from "zod";

export const BfConfigSchema = z.object({
  interfaces: z.object({
    rest: z.object({
      versioned: z.boolean().optional(),
      urlPrefix: z.string().optional(),
    }),
    graphql: z.object({
      mount: z.string().optional(),
    }),
  }),
  plugins: z.array(
    z.object({
      resolve: z.string(),
      options: z.any(),
    })
  ),
  providers: z.array(
    z.object({
      provider: z.string(),
      config: z.any(),
    })
  ),
});

export type BfConfig = z.infer<typeof BfConfigSchema>;
