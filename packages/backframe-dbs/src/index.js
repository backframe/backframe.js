/**
 * For the modules to function correctly, they cannot contain their own dependecies since those would create new
 * instances of the dependencies separate from the ones installed in the actual server
 *
 * To require a module, one has to get the module from the project root directory i.e:
 *
 *  To require mongoose will be:
 *  const mongoose = require(`${process.cwd()}/node_modules/mongoose`) instead of the common convention
 *  const mongoose = require(mongoose)
 *
 *  However, some dependencies will still work even if new instances are created such as dotenv
 */

async function initializeDB(options) {
  const dbModule = require(`../lib/${options.db}`);
  return dbModule;
}

module.exports = {
  initializeDB,
};
