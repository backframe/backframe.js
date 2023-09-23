/* eslint-disable @typescript-eslint/no-explicit-any */

import type { BfUser, Plugin } from "@backframe/core";
import { logger, require } from "@backframe/utils";
import bcrypt from "bcrypt";
import * as jose from "jose";
import merge from "lodash.merge";
import path from "path";
import { fileURLToPath } from "url";
import { Provider } from "./lib/types.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pkg = require(path.join(__dirname, "../package.json"));

type EmailTemplate = {
  from: string;
  subject: string;
  body: string;
};

export interface AuthConfig {
  appName: string;
  prefix?: string;
  encode?: <T>(payload: T, options?: unknown) => string | PromiseLike<string>;
  decode?: (token: string, options?: unknown) => any;
  verify?: (token: string, options?: unknown) => boolean | Promise<boolean>;
  hash?: (
    data: string | Buffer,
    options?: unknown
  ) => string | PromiseLike<string>;
  compare?: (
    data: string | Buffer,
    encrypted: string
  ) => boolean | PromiseLike<boolean>;
  mfaConfiguration?: {
    age?: number;
    status: "ON" | "OFF" | "OPTIONAL";
    mfaTypes?: Array<"SMS" | "EMAIL" | "TOTP">;
  };
  requiredAttributes?: Array<Partial<keyof BfUser>>;
  allowedSignInAttributes?: Array<"phone" | "email" | "username">;
  smsTemplates?: {
    verificationCode?: string;
    resetPassword?: string;
    invitation?: string;
    passwordChanged?: string;
  };
  emailTemplates?: {
    verificationCode?: EmailTemplate;
    resetPassword?: EmailTemplate;
    invitation?: EmailTemplate;
    passwordChanged?: EmailTemplate;
    organizationInvitation?: EmailTemplate;
    magicLinkSignIn?: EmailTemplate;
    magicLinkSignUp?: EmailTemplate;
    magicLinkVerifyEmail?: EmailTemplate;
  };
}

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

export const DEFAULT_CFG: AuthConfig = {
  prefix: "/auth",
  appName: "Backframe App",
  allowedSignInAttributes: ["phone", "email", "username"],
  smsTemplates: {
    verificationCode:
      "{{otp_code}} is your {{app_name}} verification code and it will expire in {{age}} minutes. Do not share this with anyone.",
    passwordChanged:
      "Your {{app_name}} password has been changed! If you did not make this change, please reach out to an administrator for support.",
    resetPassword:
      "{{otp_code}} is your {{app_name}} reset password code. It will expire in 10 minutes, do not share this with anyone.",
    invitation:
      "{{inviter_name}} has invited you to join them on {{app_name}} {{action_url}}",
  },
  // default encode is jwt
  async encode(payload, options: { secret: string; alg?: string }) {
    const s = new TextEncoder().encode(
      options?.secret || process.env.BF_AUTH_SECRET
    );

    const token = await new jose.SignJWT(payload as jose.JWTPayload)
      .setProtectedHeader({ alg: options?.alg ?? "HS256" })
      .setIssuedAt()
      // .setIssuer("urn:example:issuer")
      // .setAudience("urn:example:audience")
      .setExpirationTime("2h")
      .sign(s);

    return token;
  },
  // default decode is jwt
  async decode(token, options: { secret: string }) {
    const s = jose.base64url.decode(
      options?.secret || process.env.BF_AUTH_SECRET
    );
    const { payload } = await jose.jwtDecrypt(token, s);
    return payload;
  },
  async verify(token, options: { secret: string }) {
    const s = new TextEncoder().encode(
      options?.secret || process.env.BF_AUTH_SECRET
    );
    const { payload } = await jose.jwtVerify(token, s);
    return !!payload;
  },
  async hash(data) {
    const hash = await bcrypt.hash(data, 10);
    return hash;
  },
  async compare(data, hash) {
    const valid = await bcrypt.compare(data, hash);
    return valid;
  },
};

export default function (cfg = DEFAULT_CFG): Plugin {
  cfg = merge(DEFAULT_CFG, cfg);
  return {
    name: pkg.name,
    description:
      pkg.description || "Provides authentication for a backframe app",
    version: pkg.version || "0.0.0",
    onServerInit(bfCfg) {
      logger.dev("auth plugin registered");
      const { $server } = bfCfg;
      const { $app } = bfCfg.$server;
      const authCfg = bfCfg.getConfig("authentication");
      const providers = authCfg.providers as Provider[];

      $app.use(bfCfg.withRestPrefix(cfg.prefix), (rq, _rs, nxt) => {
        // @ts-expect-error - it will be there
        rq.authCfg = { ...cfg, ...authCfg };
        nxt();
      });

      const ignored = [];
      const credentials = providers.find((p) => p.id === "credentials");
      if (!credentials) {
        // ignore /register & /signin/credentials
        ignored.push("register.js");
        ignored.push("signin.credentials.js");
      }

      // mount auth pkg routes
      $server.$extendFrom(__dirname, {
        name: pkg.name,
        prefix: cfg.prefix,
        ignored,
      });
    },
  };
}
