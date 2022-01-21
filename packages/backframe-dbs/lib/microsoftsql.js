var Connection = require(`${process.cwd()}/node_modules/tedious`).Connection;
var Request = require(`${process.cwd()}/node_modules/tedious`).Request;

var config = {
  server: "localhost",
  authentication: {
    type: "default",
    options: {
      userName: "your_username", // update me
      password: "your_password", // update me
    },
  },
};

var connection = new Connection(config);

connection.on("connect", function (err) {
  if (err) {
    console.log(err);
  } else {
    executeStatement();
  }
});

function executeStatement() {
  request = new Request("select 123, 'hello world'", function (err, rowCount) {
    if (err) {
      console.log(err);
    } else {
      console.log(rowCount + " rows");
    }
    connection.close();
  });

  request.on("row", function (columns) {
    columns.forEach(function (column) {
      if (column.value === null) {
        console.log("NULL");
      } else {
        console.log(column.value);
      }
    });
  });

  connection.execSql(request);
}
