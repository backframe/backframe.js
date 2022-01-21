const mongoose = require(`${process.cwd()}/node_modules/mongoose`);

const options = { db: "mongodb", development: "true" };
const URI = require("./utils/resolveOptions").getURI(options);

let MONGO_URI;

if (options.development) {
  const [protocol, connectionString] = URI.split("//");
  const [credentials, data] = connectionString.split("/");
  const [dbName, options] = data.split("?");

  const testDBName = `${dbName}-test`;

  MONGO_URI = `${protocol}//${credentials}/${testDBName}?${options}`;
} else {
  MONGO_URI = URI;
}

// TODO: Try to return enhanced errors

module.exports = {
  connect: () =>
    new Promise((resolve, reject) => {
      mongoose.connect(
        MONGO_URI,
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          autoIndex: false,
        },
        (err) => {
          if (err) reject(err);
          else {
            console.log("Successfully connected to DB...");
            resolve();
          }
        }
      );
    }),
  disconnect: async () => {
    await mongoose.disconnect();
  },
};
