var levelup = require(`${process.cwd()}/node_modules/levelup`);
var db = levelup("./mydb");

db.put("name", "LevelUP", function (err) {
  if (err) return console.log("Ooops!", err);

  db.get("name", function (err, value) {
    if (err) return console.log("Ooops!", err);

    console.log("name=" + value);
  });
});
