import { createHandler, defineRouteConfig, z } from "@backframe/rest";

export const config = defineRouteConfig({
  model: "post",
  enabledMethods: ["put", "delete"],
});

export const PUT = createHandler({
  input: z.object({
    title: z.string().min(3).max(255),
  }),
  params: z.object({
    id: z.coerce.number(),
  }),
  output: z.object({
    id: z.number(),
    title: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
  }),
});

export const DELETE = createHandler({
  params: z.object({
    id: z.coerce.number(),
  }),
});

export const GET = createHandler({
  params: z.object({
    id: z.coerce.number(),
  }),
  output: z.object({
    id: z.number(),
    title: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
  }),
});
