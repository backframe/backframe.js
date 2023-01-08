import { createHandler } from "@backframe/rest";
import { client, code_verifier } from "../example-lib/github.js";

export const GET = createHandler({
  async action(ctx) {
    console.log(ctx.code_verifier);
    // exchanges code for access token
    const params = client.callbackParams(ctx.request);
    const tokenSet = await client.oauthCallback(
      `${process.env.APP_URL ?? "http://localhost:6969"}/auth/callback/github`,
      params,
      { code_verifier }
    );
    console.log(tokenSet);
    // gets user info
    const userInfo = await client.userinfo(tokenSet.access_token);
    console.log(userInfo);
    // creates user if not exists
    // creates session
    // redirects to app
    return userInfo;
  },
});
