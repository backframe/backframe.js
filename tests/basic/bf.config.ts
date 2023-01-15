import auth from "@backframe/auth";
import credentials from "@backframe/auth/providers/credentials";
import github from "@backframe/auth/providers/github";

import { defineConfig, Plugin } from "@backframe/core";

export default defineConfig({
  interfaces: {
    rest: {},
  },
  plugins: [
    auth(),
    // plugin(),
    // sockets({
    //   cors: {
    //     origin: "*",
    //   },
    // }),
  ],
  authentication: {
    strategy: "token-based",
    providers: [github(), credentials()],
  },
});

function plugin(): Plugin {
  return {
    name: "some",
    onServerInit(cfg) {
      cfg.$server?.$mountRoute(
        "get",
        "/extraa",
        (rq, rs) => rs.send("hiiii"),
        "@backframe/plugin"
      );
    },
  };
}
