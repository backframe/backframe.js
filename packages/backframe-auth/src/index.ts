/* eslint-disable @typescript-eslint/no-explicit-any */
import type { BfPluginConfig } from "@backframe/core";
import { hashSync } from "bcrypt";
import jwt from "jsonwebtoken";
import { createRequire } from "module";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const require = createRequire(__filename);
const pkg = require("../package.json");

export default function (): BfPluginConfig {
  return {
    name: pkg.name,
    description: pkg.description || "Backframe auth plugin",
    onServerInit(cfg) {
      const app = cfg.$server.$app;
      const route = (r: string) => cfg.withRestPrefix(r);

      app?.post(route("auth/local"), async (rq, rs) => {
        // TODO: Get access to database and create new user if not already exists
        const body = rq.body;
        if (!(body.email || body.password)) {
          return rs.status(400).json({
            status: "ERROR",
            message: "Invalid request body",
            description:
              "Expected to find email and password fields in the request body",
          });
        }

        // check if user exists
        // rome-ignore lint/suspicious/noExplicitAny: <explanation>
        const db = cfg.$database as any;
        let user = await db.user.findUnique({ where: { email: body.email } });
        if (user) {
          return rs.status(400).json({
            status: "ERROR",
            message: "Invalid credentials",
            description: "User already exists",
          });
        }

        // create new user
        user = await db.user.create({
          data: {
            email: body.email,
            passwordHash: hashSync(body.password, 10),
          },
        });

        return rs.status(200).json({
          status: "SUCCESS",
          message: "User authenticated successfully",
          token: jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET || "someSecretKey",
            {
              expiresIn: "1d",
            }
          ),
        });
      });
    },
  };
}

// authenticate() {
//   initializers: [];
//   middleware: [];
//   strategies: [];
// }
