const { definePlugin } = require("@backframe/core");
const { ssr } = require("./utils");

const p = definePlugin();

p.register("beforeServerStart", async (cfg) => {
  process.env.BF_DEBUG && console.log("beforeServerStart called");
  await ssr(cfg.getServer());
});

module.exports = p;
