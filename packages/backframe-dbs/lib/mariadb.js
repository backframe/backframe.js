// Require the mariadb instance from project root
const mariadb = require(`${process.cwd()}/node_modules/mariadb`);

// create the mariadb pool
const pool = mariadb.createPool(/* connection options */);
// Create a function in sharedsqloptions to get env variables, and handle test mode accordingly

// connect to the pool instance
pool
  .getConnection
  /**
   * handle errors
   * pass options
   */
  ();

module.exports = {
  connect: () => pool.getConnection(),
};
