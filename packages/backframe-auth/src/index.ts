/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  BfSettings,
  createEnvValidator,
  z,
  type Plugin,
} from "@backframe/core";
import { logger, require } from "@backframe/utils";
import bcrypt from "bcrypt";
import * as jose from "jose";
import merge from "lodash.merge";
import { Context } from "packages/backframe-rest/dist/index.js";
import path from "path";
import { fileURLToPath } from "url";
import { Provider } from "./lib/types.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pkg = require(path.join(__dirname, "../package.json"));

export type AuthConfig = BfSettings["auth"] & {
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
};

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

export const env = createEnvValidator({
  schema: z.object({
    BF_AUTH_SECRET: z.string(),
  }),
  onValidationError(error) {
    const errors: Record<string, string[]> = error.flatten().fieldErrors;
    logger.error(`auth: missing required env var, ${errors[0]}`);
    console.error(
      "❌ Invalid environment variables:",
      error.flatten().fieldErrors
    );
    throw new Error("Invalid environment variables");
  },
});

export const DEFAULT_CFG: AuthConfig = {
  // default encode is jwt
  async encode(payload, options: { secret: string; alg?: string }) {
    const s = new TextEncoder().encode(options?.secret || env.BF_AUTH_SECRET);

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
  decode(token) {
    return jose.decodeJwt(token);
  },
  async verify(token, options: { secret: string }) {
    const s = new TextEncoder().encode(options?.secret || env.BF_AUTH_SECRET);
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
      const settings = bfCfg.$settings.auth;
      cfg = merge(merge(DEFAULT_CFG, settings), cfg);

      $app.use((rq, _rs, nxt) => {
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

      async function middleware(
        ctx: Context<any>,
        {
          resourceRoles,
          currentActions,
          currentResources,
        }: {
          resourceRoles: string[];
          currentActions: string[];
          currentResources: string[];
        }
      ) {
        const unauthorized = () => ({
          status: "error",
          message: "Unauthorized",
          description: "Authorization is required to access this resource",
        });

        let userId: string;
        let userRoles: string[];

        // check requirements
        if (authCfg.strategy === "token-based") {
          const bearer = ctx.request.headers["authorization"];
          if (!bearer) return ctx.json(unauthorized(), 401);

          const token = bearer.split(" ")[1];
          if (!token) return ctx.json(unauthorized(), 401);

          try {
            const valid = await cfg.verify(token);
            if (!valid) return ctx.json(unauthorized(), 401);

            const payload = cfg.decode(token);
            if (!payload) return ctx.json(unauthorized(), 401);

            userId = payload.id;
            userRoles = payload.roles ?? [];
          } catch (e) {
            return ctx.json(unauthorized(), 401);
          }
        } else {
          throw new Error("Not implemented");
        }

        ctx.auth = {
          userId,
          roles: userRoles,
        };

        // check permissions
        if (userRoles.some((r) => resourceRoles?.includes(r))) {
          return ctx.next();
        }

        const permissions = userRoles
          .flatMap(
            (role) =>
              settings.userRolesConfiguration?.roles?.find(
                (r) => r.name === role
              )?.permissions
          );

        const allowRules = permissions?.filter((p) => p.effect === "ALLOW");
        const denyRules = permissions?.filter((p) => p.effect === "DENY");

        const allowedActions = allowRules.flatMap((p) => p.actions);
        const allowedResources = allowRules.flatMap((p) => p.resources);

        const deniedActions = denyRules.flatMap((p) => p.actions);
        const deniedResources = denyRules.flatMap((p) => p.resources);

        const denied =
          (currentActions.some((a) => deniedActions?.includes(a)) ||
            deniedActions.includes("*")) &&
          (currentResources.some((r) => deniedResources?.includes(r)) ||
            deniedResources.includes("*"));

        if (denied) return ctx.json(unauthorized(), 401);

        const authorized =
          (currentActions.every((a) => allowedActions?.includes(a)) ||
            allowedActions.includes("*")) &&
          (currentResources.every((r) => allowedResources?.includes(r)) ||
            allowedResources.includes("*"));

        if (!authorized) return ctx.json(unauthorized(), 401);

        // continue

        return ctx.next();
      }

      bfCfg.pluginsOptions["auth"] = {
        ...bfCfg.pluginsOptions["auth"],
        middleware,
      };

      // mount auth pkg routes
      $server.$extendFrom(__dirname, {
        name: pkg.name,
        prefix: cfg.routePrefix,
        ignored,
      });
    },
  };
}
