import { createHandler, defineRouteConfig, z } from "@backframe/rest";

export const config = defineRouteConfig({
  model: "post",
  enabledMethods: ["get", "post"],
  publicMethods: ["get", "post"],
});

export const POST = createHandler({
  input: z.object({
    title: z.string().min(3).max(255),
  }),
  output: z.object({
    id: z.number(),
    title: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
  }),
});

export const GET = createHandler({
  output: z.object({
    data: z.array(
      z.object({
        id: z.number(),
        title: z.string(),
        createdAt: z.date(),
        updatedAt: z.date(),
      })
    ),
  }),
});
