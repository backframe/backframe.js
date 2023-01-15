import { createHandler } from "@backframe/rest";

export const GET = createHandler({
  action() {
    return {
      status: "success",
      message: "Google OAuth2 route",
    };
  },
});
