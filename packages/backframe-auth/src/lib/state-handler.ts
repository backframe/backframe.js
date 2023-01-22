import { generators } from "openid-client";
import { InternalOptions } from "./oauth.js";

const STATE_MAX_AGE = 60 * 15; // 15 minutes in seconds

/** Returns state if the provider supports it */
export function createState(options: InternalOptions) {
  const { provider, auth, cookies } = options;

  if (!provider.checks?.includes("state")) {
    // @ts-expect-error Provider does not support state, return nothing.
    return;
  }

  const state = generators.state();

  const expires = new Date();
  expires.setTime(expires.getTime() + STATE_MAX_AGE * 1000);

  // encode the state and store in cookie
  const encoded = auth.encode({
    state,
    expires,
  });

  return {
    value: state,
    cookie: {
      name: cookies.names.state,
      value: encoded,
      options: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      },
    },
  };
}
