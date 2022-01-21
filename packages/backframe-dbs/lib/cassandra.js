var cassandra = require(`${process.cwd()}/node_modules/cassandra-driver`);
var client = new cassandra.Client({ contactPoints: ["localhost"] });

client.execute("select key from system.local", function (err, result) {
  if (err) throw err;
  console.log(result.rows[0]);
});
