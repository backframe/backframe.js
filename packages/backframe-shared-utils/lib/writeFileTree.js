const path = require("path");
const fs = require("fs-extra");

module.exports.writeMultiple = (dir, files) => {
  Object.keys(files).forEach((name) => {
    const filePath = path.join(dir, name);

    fs.ensureDirSync(dir);
    fs.writeFileSync(filePath, files[name]);
  });
};

module.exports.writeSingle = (path, name, data) => {
  fs.ensureDirSync(path);
  name && fs.writeFileSync(`${path}/${name}`, data);
};
