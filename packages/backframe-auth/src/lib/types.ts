import { BfSettings } from "@backframe/core";
import { CookieOptions } from "express";
import type { JWK } from "jose";
import * as jose from "jose";
import {
  BaseClient,
  ClientMetadata,
  HttpOptions,
  IssuerMetadata,
  TokenSet,
  UserinfoResponse,
} from "openid-client";

export type AuthConfig = BfSettings["auth"] & {
  encode?: <T>(payload: T, options?: unknown) => string | PromiseLike<string>;
  decode?: (token: string, options?: unknown) => JWTPayload;
  verify?: (token: string, options?: unknown) => boolean | Promise<boolean>;
  hash?: (
    data: string | Buffer,
    options?: unknown
  ) => string | PromiseLike<string>;
  compare?: (
    data: string | Buffer,
    encrypted: string
  ) => boolean | PromiseLike<boolean>;
};

export type JWTPayload = jose.JWTPayload & {
  sub: string;
  roles?: string[];
  iat: string;
  exp: string;
  iss?: string;
  aud?: string;
  [key: string]: unknown;
};

export type ProviderType = "oauth" | "email" | "credentials";
export type PartialIssuer = Partial<
  Pick<IssuerMetadata, "jwks_endpoint" | "issuer">
>;
export type Provider = OAuthConfig<unknown>;
export type User = {
  id: string;
  name?: string;
  email?: string;
  image?: string;
} & Record<string, unknown>;
export type ChecksType = "pkce" | "state" | "none" | "nonce";

export type Cookie = {
  name: string;
  value: string;
  options: Partial<CookieOptions>;
};

export type InternalProvider = Provider & {
  callbackURL: string;
};

export interface CommonProviderOptions {
  id: string;
  name: string;
  type: ProviderType;
  options?: Record<string, unknown>;
}

export interface OAuthConfig<P> extends CommonProviderOptions, PartialIssuer {
  /**
   * OpenID Connect (OIDC) compliant providers can configure
   * this instead of `authorize`/`token`/`userinfo` options
   * without further configuration needed in most cases.
   * You can still use the `authorize`/`token`/`userinfo`
   * options for advanced control.
   *
   * [Authorization Server Metadata](https://datatracker.ietf.org/doc/html/rfc8414#section-3)
   */
  wellKnown?: string;
  /**
   * The login process will be initiated by sending the user to this URL.
   *
   * [Authorization endpoint](https://datatracker.ietf.org/doc/html/rfc6749#section-3.1)
   */
  authorization?: {
    url?: string;
    params?: Record<string, unknown>;
  };
  token?: string;
  userinfo?: string;
  userInfoRequest?: (cfg: {
    tokens: TokenSet;
    client: BaseClient;
  }) => Promise<UserinfoResponse<P>>;
  type: "oauth" | "credentials" | "email";
  version?: string;
  profile?: (profile: P, tokens: TokenSet) => Promise<User> | User;
  checks?: ChecksType | ChecksType[];
  client?: Partial<ClientMetadata>;
  jwks?: { keys: JWK[] };
  clientId?: string;
  clientSecret?: string;
  /**
   * If set to `true`, the user information will be extracted
   * from the `id_token` claims, instead of
   * making a request to the `userinfo` endpoint.
   *
   * `id_token` is usually present in OpenID Connect (OIDC) compliant providers.
   *
   * [`id_token` explanation](https://www.oauth.com/oauth2-servers/openid-connect/id-tokens)
   */
  idToken?: boolean;
  // TODO: only allow for BattleNet
  region?: string;
  // TODO: only allow for some
  issuer?: string;
  /** Read more at: https://github.com/panva/node-openid-client/tree/main/docs#customizing-http-requests */
  httpOptions?: HttpOptions;

  /**
   * The options provided by the user.
   * We will perform a deep-merge of these values
   * with the default configuration.
   */
  options?: OAuthUserConfig<P>;

  // These are kept around for backwards compatibility with OAuth 1.x
  accessTokenUrl?: string;
  requestTokenUrl?: string;
  profileUrl?: string;
  encoding?: string;
}

export type OAuthUserConfig<P> = Omit<
  Partial<OAuthConfig<P>>,
  "options" | "type"
> &
  Required<Pick<OAuthConfig<P>, "clientId" | "clientSecret">>;

export type SMSTemplateConfig<T extends keyof AuthConfig["smsTemplates"]> =
  T extends "verificationCode"
    ? {
        event: "verificationCode";
        vars: {
          otp_code: string;
          app_name: string;
          age: number;
        };
      }
    : T extends "resetPassword"
    ? {
        event: "resetPassword";
        vars: {
          otp_code: string;
          app_name: string;
          age: number;
        };
      }
    : T extends "invitation"
    ? {
        event: "invitation";
        vars: {
          inviter_name: string;
          app_name: string;
          action_url: string;
        };
      }
    : T extends "passwordChanged"
    ? {
        event: "passwordChanged";
        vars: {
          app_name: string;
        };
      }
    : never;
