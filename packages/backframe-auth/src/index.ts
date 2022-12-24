import type { BfPluginConfig } from "@backframe/core";
import jwt from "jsonwebtoken";
import { createRequire } from "module";
import passport from "passport";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const require = createRequire(__filename);
const pkg = require("../package.json");

export default function (): BfPluginConfig {
  return {
    name: pkg.name,
    description: pkg.description || "Backframe auth plugin",
    modifyServer(cfg) {
      const app = cfg.server?._app;

      app?.post("/auth/local", (rq, rs) => {
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

        // TODO: Sync with Database
        return rs.status(200).json({
          status: "SUCCESS",
          message: "User authenticated successfully",
          token: jwt.sign({ id: body.email }, "someSecretKey", {
            expiresIn: "1d",
          }),
        });
      });
    },
    async modifyConfig(cfg) {
      // TODO: Sync with userCfg and enabled strategies... etc
      cfg.__auth = passport.initialize();
      cfg.__authMiddleware = passport.authenticate("jwt", { session: false });
      cfg.__authStrategies = () =>
        import("./strategies/jwt.js").then(async (m) => await m.default(cfg));
    },
  };
}

// authenticate() {
//   initializers: [];
//   middleware: [];
//   strategies: [];
// }
