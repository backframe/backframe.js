import { createHandler } from "@backframe/rest";

export const GET = createHandler({
  action(_ctx) {
    return "Hello World!!!";
  },
});
