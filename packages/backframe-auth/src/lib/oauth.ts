import { BfConfig } from "@backframe/core";
import { DB } from "@backframe/models";
import { Context } from "@backframe/rest";
import { Issuer } from "openid-client";
import { AuthConfig, DEFAULT_CFG } from "../index.js";
import { InternalProvider, Provider } from "./types";

export type InternalOptions = {
  db: DB;
  bf: BfConfig;
  auth: AuthConfig;
  providerId: string;
  providers: InternalProvider[];
  provider: InternalProvider;
};

export async function openidClient(opts: InternalOptions) {
  const { provider } = opts;
  let issuer: Issuer;
  if (provider.wellKnown) {
    issuer = await Issuer.discover(provider.wellKnown);
  } else {
    issuer = new Issuer({
      issuer: provider.issuer,
      authorization_endpoint: provider.authorization.url,
      token_endpoint: provider.token,
      userinfo_endpoint: provider.userinfo,
    });
  }

  const client = new issuer.Client(
    {
      client_id: provider.clientId,
      client_secret: provider.clientSecret,
      redirect_uris: [provider.callbackURL],
      response_types: ["code"],
    },
    provider.jwks
  );

  return client;
}

export function getOptions(ctx: Context<unknown, any>): InternalOptions {
  const bf = ctx.config;
  const auth = (ctx.request.authCfg ?? DEFAULT_CFG) as AuthConfig;
  const { provider: providerId } = ctx.params;
  const providers = bf.getConfig("authentication").providers as Provider[];

  const normalized: InternalProvider[] = providers.map(
    (p) =>
      ({
        ...p,
        callbackURL: `${
          process.env.APP_URL ?? "http://localhost:6969"
        }${bf.withRestPrefix(auth.prefix)}/callback/${providerId}`,
        ...p.options,
      } as InternalProvider)
  );

  return {
    bf,
    auth,
    providerId,
    providers: normalized,
    provider: normalized.find((provider) => provider.id === providerId),
    db: ctx.db as DB,
  };
}
