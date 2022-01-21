const path = require("path");

module.exports.getURI = (options) => {
  const ctx = options.rootDir || process.cwd();
  require("dotenv").config({ path: path.join(ctx, ".env") });
  const DB_URI = process.env.DB_URI;

  return DB_URI;
};
