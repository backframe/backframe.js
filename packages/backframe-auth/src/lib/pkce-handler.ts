import { generators } from "openid-client";
import { InternalOptions } from "./oauth.js";

const PKCE_CODE_CHALLENGE_METHOD = "S256";
const PKCE_MAX_AGE = 60 * 15; // 15 minutes in seconds

/** Returns state if the provider supports it */
export function createPKCE(options: InternalOptions) {
  const { provider, auth, cookies } = options;

  if (!provider.checks?.includes("pkce")) {
    // @ts-expect-error Provider does not support PKCE, return nothing.
    return;
  }
  const code_verifier = generators.codeVerifier();
  const code_challenge = generators.codeChallenge(code_verifier);

  const expires = new Date();
  expires.setTime(expires.getTime() + PKCE_MAX_AGE * 1000);

  // encode the code verifier and store in cookie
  const encoded = auth.encode({
    code_verifier,
    expires,
  });

  return {
    code_challenge,
    code_challenge_method: PKCE_CODE_CHALLENGE_METHOD,
    cookie: {
      name: cookies.names.codeVerifier,
      value: encoded,
      options: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      },
    },
  };
}
