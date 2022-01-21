const path = require("path");
require("dotenv").config({ path: path.join(process.cwd(), ".env") });

exports.getDBOptions = (options) => {
  if (options.development) {
    return ({ DEV_DB_HOST, DEV_DB_USER, DEV_DB_PASSWORD, DEV_DB_NAME } =
      process.env);
  } else {
    const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

    return {
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
    };
  }
};
