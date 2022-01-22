const EventEmitter = require("events");
const path = require("path");
const fs = require("fs-extra");
const { writeSingle } = require("../lib/writeFileTree");
const { tldComment, errorMsg } = require("../lib/constants");
const { toTitleCase, pluralize } = require("../lib/utils");
const FunctionBuilder = require("./FunctionBuilder");

class RestGenerator extends EventEmitter {
  constructor(name, ctx, options) {
    super();
    this.name = name.toLowerCase();
    this.options = options;
    this.ctx = ctx;
    this.bfConfig = `${ctx}/backframe.json`;
  }

  getConfig() {
    const fileContents = fs.readFileSync(this.bfConfig).toString();
    const parsed = JSON.parse(fileContents);

    return parsed;
  }

  generateResource() {
    // TODO: Try using some basic name validation
    this.emit("starting");

    const configOptions = this.getConfig();

    // copy to mutate
    const copy = Object.assign({}, configOptions);

    // check if api exists
    const exists = configOptions.apis.filter((api) => api === "rest").pop();
    const base = copy.endpoints["rest"];

    if (exists) {
      base[this.name] = {};
    } else {
      copy.apis.push(this.name);
      base[this.name] = {};
    }

    // save options into new backframe.json
    base[this.name]["methods"] = { ...this.options.methods };
    let dummyData = `'use strict'\n\n${tldComment}`;

    // generate routes folders and files
    let filePath;
    if (this.options.version) {
      filePath = path.join(this.ctx, "routes", `v${this.options.version}`);
    } else {
      filePath = path.join(this.ctx, "routes");
    }

    ["controller", "spec", "route"].forEach((val) => {
      const name = `${pluralize(this.name)}.${val}.js`;
      writeSingle(`${filePath}/${pluralize(this.name)}`, name, dummyData);
    });

    // generate name.model.js
    let modelPath;
    if (this.options.version) {
      modelPath = path.join(this.ctx, "models", `v${this.options.version}`);
    } else {
      modelPath = path.join(this.ctx, "models");
    }

    const modelName = `${pluralize(this.name)}.model.js`;
    writeSingle(modelPath, modelName, dummyData);

    // replcace existing backframe.json
    fs.writeFileSync(this.bfConfig, JSON.stringify(copy, null, 2));

    this.injectController(
      `${filePath}/${pluralize(this.name)}/${pluralize(
        this.name
      )}.controller.js`
    );
  }

  injectController(file, resource = this.name) {
    const config = this.getConfig();
    const methods = config.endpoints["rest"][resource].methods;

    let imports = [];
    //   Implementing get methods
    if (methods.hasOwnProperty("get")) {
      let name = toTitleCase(resource);
      const base = methods["get"];

      if (base.getAll) imports.push(`getAll${name}s`);
      for (const val of base.allowedFields) {
        if (val !== undefined) imports.push(`get${name}By${toTitleCase(val)}`);
      }
      for (const sub of base.subResources) {
        if (sub !== undefined) imports.push(`get${name}${toTitleCase(sub)}s`);
      }
      imports.push(`get${name}`);
    }

    // post methods
    if (methods.hasOwnProperty("post")) {
      let name = toTitleCase(resource);
      // let base = methods["post"]

      imports.push(`post${name}`);
    }

    if (methods.hasOwnProperty("put")) {
      let name = toTitleCase(resource);
      imports.push(`put${name}`);
    }

    if (methods.hasOwnProperty("delete")) {
      let name = toTitleCase(resource);
      imports.push(`delete${name}`);
    }

    const address = this.resolveAddress(file, this.ctx);
    const importStatement = `const {${Object.values(
      imports
    )}} = require("${address.replace(/\\/g, "/")}")`;

    let exports = [],
      functions = [];
    // controller imports done, now build functions
    imports.forEach((i) => {
      let name = `http${toTitleCase(i)}`;
      const fn = new FunctionBuilder(
        name,
        "",
        { req: "req", res: "res" },
        { export: true }
      );
      fn.injectBody(`
  ${i}(req.params.value)
    .then((data) => {
      res.status(200).json(data)
    })
    .catch((e) => {
      process.env.NODE_ENV === "development" && console.log(e)
      res.status(500).json()
    })
      `);
      functions.push(fn.build(name));
      fn.options.export && exports.push(name);
    });

    const moduleTemp = `module.exports = {
    ${Object.values(exports)}
}`;

    const body = fs.readFileSync(file);
    fs.writeFileSync(
      file,
      `${body}\n${importStatement}\n
      \n${Object.values(functions)
        .toString()
        .replace(/},/g, "}")}\n\n${moduleTemp}`
    );
  }

  injectModel() {}

  resolveAddress() {
    if (this.options.version) {
      return path.join(
        "../../..",
        "models",
        `v${this.options.version}`,
        `${pluralize(this.name)}.model.js`
      );
    } else {
      return path.join("../..", "models", `${pluralize(this.name)}.model.js`);
    }
  }
}

module.exports = RestGenerator;
