import { BfPluginConfig, defineConfig } from "@backframe/core";
import sockets from "@backframe/sockets";

export default defineConfig({
  interfaces: {
    rest: {},
  },
  plugins: [
    plugin(),
    sockets({
      cors: {
        origin: "*",
      },
    }),
  ],
});

function plugin(): BfPluginConfig {
  return {
    modifyServer() {
      console.log("first");
    },
  };
}
