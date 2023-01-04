import { createHandler } from "@backframe/rest";

export const GET = createHandler({
  action() {
    return "Catchall works";
  },
});
