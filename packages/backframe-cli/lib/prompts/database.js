// TODO: Implement functionality for the database
/**
 * 1. Elasticsearch
 * 2. Redis
 * 3. MongoDB
 * 4. My SQL
 * 5. Microsoft SQL server
 * 6. Maria DB
 * 7. Cloud Firestore [If selected, Firebase compatibility by default]
 * 8. Apache Cassandra
 * 9. Cockroach DB
 * 10. Couch DB
 */

module.exports = () => {
  const values = [
    {
      name: "Cassandra",
      value: "cassandra",
    },

    {
      name: "Cloud Firestore",
      value: "firestore",
    },
    {
      name: "Couchbase",
      value: "couchbase",
    },
    {
      name: "CouchDB",
      value: "couchdb",
    },
    {
      name: "Elasticsearch",
      value: "elasticsearch",
    },
    {
      name: "LevelDB",
      value: "leveldb",
    },
    {
      name: "MariaDB",
      value: "mariadb",
    },
    {
      name: "My SQL",
      value: "mysql",
    },
    {
      name: "MongoDB",
      value: "mongodb",
    },
    {
      name: "Neo4j",
      value: "neo4j",
    },
    {
      name: "Oracle DB",
      value: "oracledb",
    },
    {
      name: "PostgresQL",
      value: "postgres",
    },
    {
      name: "Redis",
      value: "redis",
    },
    {
      name: "Microsoft SQL Server",
      value: "microsoftsql",
    },
    {
      name: "SQLite",
      value: "sqlite",
    },
  ];

  const DBPrompt = {
    type: "list",
    name: "database",
    message: "Select a database:",
    choices: [...values],
    default: "mongodb",
  };

  //   TODO: add db options prompt depending on the specifi database that was selected

  return DBPrompt;
};
