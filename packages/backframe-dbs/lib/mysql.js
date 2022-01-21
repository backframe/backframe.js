const { getDBOptions } = require("./utils/sqlSharedOptions");

const mysql = require(`${process.cwd()}/node_modules/mysql`);

const { host, user, password, database } = getDBOptions({ db: "mysql" });

const connection = mysql.createConnection({
  host,
  user,
  password,
  database,
});

// TODO: Try presenting the errots to the user in a better way
module.exports = {
  connect: () => connection.connect(),
  query: (queryString, escapedValues) =>
    new Promise((resolve, reject) => {
      connection.query(queryString, escapedValues, (error, results, fields) => {
        if (error) reject(error);
        resolve({ results, fields });
      });
    }),
  end: () => connection.end(),
};
