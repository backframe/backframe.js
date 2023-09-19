import { createHandler, z } from "@backframe/rest";

export const PUT = createHandler({
  params: z.object({
    id: z.coerce.number(),
  }),
});
