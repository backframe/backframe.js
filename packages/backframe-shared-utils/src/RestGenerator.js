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
    this.modelPath = "";
    this.controllerPath = "";
    this.routerPath = "";
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
    if (this.options.version) {
      this.modelPath = path.join(
        this.ctx,
        "models",
        `v${this.options.version}`
      );
    } else {
      this.modelPath = path.join(this.ctx, "models");
    }

    const modelName = `${pluralize(this.name)}.model.js`;
    writeSingle(this.modelPath, modelName, dummyData);

    // replace existing backframe.json
    fs.writeFileSync(this.bfConfig, JSON.stringify(copy, null, 2));

    let [imp, exp] = this.injectController(
      `${filePath}/${pluralize(this.name)}/${pluralize(
        this.name
      )}.controller.js`
    );

    this.injectModel(imp, `${this.modelPath}/${modelName}`);
  }

  injectController(file, resource = this.name) {
    const config = this.getConfig();
    const methods = config.endpoints["rest"][resource].methods;

    let imports = [];
    //   Implementing get methods
    if (methods.hasOwnProperty("get")) {
      let name = toTitleCase(resource);
      const base = methods["get"];

      if (base.getAll) imports.push({ name: `getAll${name}s`, params: [""] });
      for (const val of base.allowedFields) {
        if (val !== undefined)
          imports.push({
            name: `get${name}By${toTitleCase(val)}`,
            params: [`${val}`],
          });
      }
      for (const sub of base.subResources) {
        if (sub !== undefined)
          imports.push({
            name: `get${name}${toTitleCase(sub)}s`,
            params: [`${sub}`, `id`],
          });
      }
      imports.push({ name: `get${name}`, params: [`id`] });
    }

    // post methods
    if (methods.hasOwnProperty("post")) {
      let name = toTitleCase(resource);
      // let base = methods["post"]

      imports.push({ name: `post${name}`, params: [``] });
    }

    if (methods.hasOwnProperty("put")) {
      let name = toTitleCase(resource);
      imports.push({ name: `put${name}`, params: [`id`] });
    }

    if (methods.hasOwnProperty("delete")) {
      let name = toTitleCase(resource);
      imports.push({ name: `delete${name}`, params: [`id`] });
    }

    const address = this.resolveAddress(file, this.ctx);
    const importStatement = `const {${imports.map(
      (i) => i.name
    )}} = require("${address.replace(/\\/g, "/")}")`;

    let exports = [],
      functions = [];
    // controller imports done, now build functions
    imports.forEach((i) => {
      let name = `http${toTitleCase(i.name)}`;
      const fn = new FunctionBuilder(name, ["req", "res"], {
        export: true,
      });
      fn.injectBody(`
  ${i.name}(${i.params.map((p) => (p ? `req.params.${p}` : ``))})
    .then((data) => {
      res.status(200).json(data)
    })
    .catch((e) => {
      process.env.NODE_ENV === "development" && console.log(e)
      res.status(500).json({msg: "An internal error occurred, please try again later"})
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

    return [imports, exports];
  }

  injectRouter() {}

  injectModel(exp, file) {
    const data = fs.readFileSync(file);

    let functions = [];
    exp.forEach((e) => {
      console.log(e.params);
      let fn = new FunctionBuilder(e.name, e.params);
      functions.push(fn.build(e.name));
    });

    const exportStatement = `module.exports = {
    ${exp.map((i) => i.name)}
}`;

    // write new data
    fs.writeFileSync(
      file,
      `${data}\n
    ${Object.values(functions).toString().replace(/},/g, "}")}
    \n${exportStatement}`
    );
  }

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
