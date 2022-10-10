const { definePlugin } = require("@backframe/core");
const { ssr } = require("./utils");

const p = definePlugin();

p.beforeServerStart = async (cfg) => {
  process.env.BF_DEBUG && console.log("beforeServerStart called");
  const app = cfg.server._app;
  await ssr(app);
  return cfg;
};

module.exports = p;
