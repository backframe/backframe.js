var couchbase = require(`${process.cwd()}/node_modules/couchbase`);
var bucket = new couchbase.Cluster("http://localhost:8091").openBucket(
  "bucketName"
);

// add a document to a bucket
bucket.insert(
  "document-key",
  { name: "Matt", shoeSize: 13 },
  function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
    }
  }
);

// get all documents with shoe size 13
var n1ql = "SELECT d.* FROM `bucketName` d WHERE shoeSize = $1";
var query = N1qlQuery.fromString(n1ql);
bucket.query(query, [13], function (err, result) {
  if (err) {
    console.log(err);
  } else {
    console.log(result);
  }
});
