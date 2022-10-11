const { definePlugin } = require("@backframe/core");
const { ssr } = require("./utils");
const { logger } = require("@backframe/utils");

const p = definePlugin();

p.beforeServerStart = async (cfg) => {
  process.env.BF_DEBUG && console.log("beforeServerStart called");
  const app = cfg.server._app;
  await ssr(app);
  // TODO: pass db and auth objects to plugin
  return cfg;
};

p.afterServerStart = (cfg) => {
  logger.debug(
    `admin ui ready on http://localhost:${cfg.server.cfg.port}/admin`
  );
};

module.exports = p;
