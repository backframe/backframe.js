/* eslint-disable @typescript-eslint/no-explicit-any */
import { BfConfig, BfDatabase, BfUserConfig } from "@backframe/core";
import { Context } from "@backframe/rest";
import { Issuer } from "openid-client";
import { AuthConfig, DEFAULT_CFG } from "../index.js";
import { InternalProvider, Provider } from "./types";

export type InternalOptions = {
  db: BfDatabase;
  bf: BfConfig;
  auth: AuthConfig & BfUserConfig["authentication"];
  providerId: string;
  providers: InternalProvider[];
  provider: InternalProvider;
  cookies: {
    names: {
      nonce: string;
      state: string;
      codeVerifier: string;
      session: string;
    };
    vals?: Record<string, string>;
  };
  referer?: string;
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

export function getOptions(ctx: Context<any>): InternalOptions {
  const bf = ctx.config;

  const auth = (ctx.request.authCfg ?? {
    ...DEFAULT_CFG,
    ...bf.getConfig("authentication"),
  }) as AuthConfig;
  const { provider: providerId } = ctx.params as any;
  const providers = bf.getConfig("authentication").providers as Provider[];

  const normalized: InternalProvider[] = providers.map((p) => {
    const clientId = process.env[`${p.id.toUpperCase()}_CLIENT_ID`];
    const clientSecret = process.env[`${p.id.toUpperCase()}_CLIENT_SECRET`];

    return {
      clientId,
      clientSecret,
      ...p,
      callbackURL: `${
        process.env.APP_URL ?? "http://localhost:6969"
      }${bf.withRestPrefix(auth.prefix)}/callback/${providerId}`,
      options: {
        clientId,
        clientSecret,
        ...p.options,
      },
    } as InternalProvider;
  });

  const reqCookies = (ctx.request.cookies || {}) as Record<string, string>;
  const cookies: InternalOptions["cookies"] = {
    names: {
      state: `${bf}-oauth-state`,
      codeVerifier: `${bf}-oauth-code-verifier`,
      nonce: `${bf}-oauth-nonce`,
      session: `${bf}-auth-session`,
    },
    vals: {},
  };

  for (const [key, value] of Object.entries(reqCookies)) {
    cookies.vals[key] = reqCookies[value];
  }

  return {
    bf,
    auth,
    providerId,
    providers: normalized,
    provider: normalized.find((provider) => provider.id === providerId),
    db: ctx.db,
    cookies,
    referer: cookies.vals?.["referer"] ?? ctx.request.headers.referer,
  };
}
