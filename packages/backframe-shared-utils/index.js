const RestGenerator = require("./src/RestGenerator");
const {toTitleCase, pluralize} = require("./lib/utils");
const {writeMultiple, writeSingle} = require("./lib/writeFileTree");
const {hasGit, hasYarn} = require("./src/checkEnv");

module.exports = {
  RestGenerator,
  toTitleCase,
  pluralize,
  writeMultiple,
  writeSingle,
  hasGit,
  hasYarn,
};
