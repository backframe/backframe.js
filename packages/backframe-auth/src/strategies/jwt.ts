import type { BfConfig } from "@backframe/core";
import passport from "passport";
import { ExtractJwt, Strategy, StrategyOptions } from "passport-jwt";

export default async function (_cfg: BfConfig) {
  const opts: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: "someSecretKey",
  };

  // TODO: Convert to fn that takes in config to sync with the DB
  passport.use(
    new Strategy(opts, function (payload, done) {
      if (payload.id !== "test@gmail.com") {
        done(
          {
            status: "ERROR",
            message: "Invalid credentials",
          },
          false
        );
      } else {
        done(null, { email: "test@gmail.com" });
      }
    })
  );
}
