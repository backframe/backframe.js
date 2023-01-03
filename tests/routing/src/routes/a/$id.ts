import { createHandler } from "@backframe/rest";

export const GET = createHandler({
  action(ctx) {
    return `${ctx.params.id}`;
  },
});
