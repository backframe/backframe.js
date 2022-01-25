const RestGenerator = require("./src/RestGenerator");
const { toTitleCase, pluralize } = require("./lib/utils");
const { writeMultiple, writeSingle } = require("./lib/writeFileTree");

module.exports = {
  RestGenerator,
  toTitleCase,
  pluralize,
  writeMultiple,
  writeSingle,
};
