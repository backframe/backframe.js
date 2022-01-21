var neo4j = require(`${process.cwd()}/node_modules/neo4j-driver`);
var driver = neo4j.driver(
  "neo4j://localhost:7687",
  neo4j.auth.basic("neo4j", "letmein")
);

var session = driver.session();

session.readTransaction(function (tx) {
  return tx
    .run("MATCH (n) RETURN count(n) AS count")
    .then(function (res) {
      console.log(res.records[0].get("count"));
    })
    .catch(function (error) {
      console.log(error);
    });
});
