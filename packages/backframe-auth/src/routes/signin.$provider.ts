import { createHandler } from "@backframe/rest";
import { AuthorizationParameters } from "openid-client";
import { ProviderNotFound } from "../lib/errors.js";
import { getOptions, openidClient } from "../lib/oauth.js";
import { createPKCE } from "../lib/pkce-handler.js";
import { Cookie } from "../lib/types.js";

export const GET = createHandler({
  async action(ctx) {
    const opts = getOptions(ctx);
    const { provider } = opts;
    const cookies: Cookie[] = [];

    if (!provider) {
      return ctx.json(ProviderNotFound(), 400);
    }

    cookies.push({ name: "host", value: ctx.request.hostname, options: {} });

    const client = await openidClient(opts);
    const params: AuthorizationParameters = provider.authorization.params ?? {};

    const pkce = createPKCE(opts);
    if (pkce) {
      params.code_challenge = pkce.code_challenge;
      params.code_challenge_method = "S256";
      cookies.push(pkce.cookie as Cookie);
    }

    const authorizationUrl = client.authorizationUrl(params);
    cookies.forEach((cookie) => {
      ctx.response.cookie(cookie.name, cookie.value, cookie.options);
    });

    return ctx.redirect(authorizationUrl);
  },
});
