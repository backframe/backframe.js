/* eslint-disable @typescript-eslint/no-explicit-any */

import { createEnvValidator, z, type Plugin } from "@backframe/core";
import { Context } from "@backframe/rest";
import { logger, require } from "@backframe/utils";
import bcrypt from "bcrypt";
import * as jose from "jose";
import merge from "lodash.merge";
import path from "path";
import { fileURLToPath } from "url";
import { evaluatePolicies } from "./lib/policies.js";
import { AuthConfig, JWTPayload, Provider } from "./lib/types.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pkg = require(path.join(__dirname, "../package.json"));

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
      .setExpirationTime("2h")
      .sign(s);

    return token;
  },
  // default decode is jwt
  decode(token) {
    return jose.decodeJwt(token) as unknown as JWTPayload;
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
          public: isPublic,
        }: {
          resourceRoles: string[];
          currentActions: string[];
          currentResources: string[];
          public?: boolean;
        }
      ) {
        const unauthorized = (msg?: string) => {
          return ctx.json(
            {
              status: "error",
              message: msg || "Unauthorized",
              description: "Authorization is required to access this resource.",
            },
            401
          );
        };

        let userId: string;
        let userRoles: string[] = [];

        // check authenication
        if (authCfg.strategy === "token-based") {
          const bearer = ctx.request.headers["authorization"];
          const token = bearer?.split(" ")[1];

          if (token) {
            try {
              await cfg.verify(token);
            } catch (e) {
              return unauthorized(e.message || "Invalid JWT token");
            }

            const payload = cfg.decode(token);
            if (!payload) return unauthorized("Invalid JWT token");

            userId = payload.sub;
            userRoles = payload.roles ?? [];
          } else if (!isPublic) {
            return unauthorized("No bearer token found");
          }
        } else {
          throw new Error("Not implemented");
        }

        ctx.auth = {
          userId,
          roles: userRoles,
        };

        // check permissions (authz)
        if (userId) {
          if (userRoles.some((r) => resourceRoles?.includes(r))) {
            return ctx.next();
          }

          const allowed = await evaluatePolicies(ctx, {
            roles: userRoles,
            status: "before",
            attemptedActions: currentActions,
            attemptedResources: currentResources,
          });

          if (!allowed) return ctx.json(unauthorized(), 401);
        } else if (!isPublic) {
          return unauthorized();
        }

        return ctx.next();
      }

      // pass middleware to auth config
      bfCfg.$updateAuthOptions({ middleware, evaluatePolicies });

      // mount auth pkg routes
      $server.$extendFrom(__dirname, {
        name: pkg.name,
        prefix: cfg.routePrefix,
        ignored,
      });
    },
  };
}
