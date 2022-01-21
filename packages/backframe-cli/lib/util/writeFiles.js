import fs from "fs";
import path from "path";

export default (dir, files) => {
  Object.keys(files).forEach((name) => {
    const filePath = path.join(dir, name);

    // TODO: install fs-extra to simplify this

    if (fs.existsSync(dir)) {
      fs.writeFileSync(filePath, files[name]);
    } else {
      fs.mkdirSync(dir);
      fs.writeFileSync(filePath, files[name]);
    }
  });
};
