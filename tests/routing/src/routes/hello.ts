import { createHandler, defineRouteConfig } from "@backframe/rest";

export const config = defineRouteConfig({
  enabledMethods: ["get"],
});

export const GET = createHandler({
  action() {
    return "Hello World!!!";
  },
});
