import { createHandler, defineRouteConfig } from "@backframe/rest";
import { POST as createUser } from "../register/index.js";

export const config = defineRouteConfig({
  enabledMethods: [],
  publicMethods: ["post"],
});

export const POST = createHandler({
  query: createUser.query,
  input: createUser.input,
  async action(ctx) {
    ctx.roles = ["ADMIN"];
    return await createUser.action(ctx);
  },
  async auth(ctx, cfg) {
    // allow if its the first user
    const users = await ctx.db.list("user", { limit: 1 });
    if (users.length === 0) return cfg.allow();

    // if users exist, allow admin only
    if (ctx.auth.roles.includes("ADMIN")) return cfg.allow();

    // otherwise deny
    return cfg.deny("You shall not pass!");
  },
});
