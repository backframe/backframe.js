import { createHandler } from "@backframe/rest";

export const GET = createHandler({
  action(ctx) {
    const { provider } = ctx.params;
    return provider;
  },
});
