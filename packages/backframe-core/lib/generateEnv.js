const fs = require("fs");
const path = require("path");

function generateEnv(body) {
  const ctx = process.cwd();
  const pathToEnv = path.join(ctx, ".env");

  // copy existing env variables then mutate
  let data = fs.readFileSync(pathToEnv, { encoding: "utf8" });
  body.envs.forEach((e) => {
    const encoding = `${e.key} = ${e.value}`;
    data = data + `\n` + Buffer.from(encoding);
  });

  //   open file and overwrite raw contents with new ones
  fs.writeFileSync(pathToEnv, data);
  console.log("done");
}

module.exports = {
  generateEnv,
};
