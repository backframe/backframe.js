var elasticsearch = require(`${process.cwd()}/node_modules/elasticsearch`);
var client = elasticsearch.Client({
  host: "localhost:9200",
});

client
  .search({
    index: "books",
    type: "book",
    body: {
      query: {
        multi_match: {
          query: "express js",
          fields: ["title", "description"],
        },
      },
    },
  })
  .then(
    function (response) {
      var hits = response.hits.hits;
    },
    function (error) {
      console.trace(error.message);
    }
  );
