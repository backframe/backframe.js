import { prisma } from "@/server";
import { createHandler, defineRouteConfig } from "@backframe/rest";

export const config = defineRouteConfig({
  model: "user",
  securedMethods: [],
});

export const GET = createHandler({
  async action() {
    return await prisma.user.findFirst();
  },
});
