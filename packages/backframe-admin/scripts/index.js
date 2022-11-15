// const { definePlugin } = require("@backframe/core");
const { ssr } = require("./utils");
const { logger } = require("@backframe/utils");

// const p = definePlugin();

// p.register("beforeServerStart", async (cfg) => {
//   process.env.BF_DEBUG && console.log("beforeServerStart called");
//   await ssr(cfg.getServer());
// });

module.exports = (cfg) => {
  cfg.addListener("beforeServerStart", async () => {
    await ssr(cfg.getInternalApp());
  });
  cfg.addListener("afterServerStart", () => {
    logger.info(`admin ui ready on ${cfg.getServer().getHost()}/admin`);
  });
};
