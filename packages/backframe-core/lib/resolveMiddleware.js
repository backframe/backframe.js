const fs = require("fs");

const ctx = `${process.cwd()}/backframe.json`;
const serverOptions = fs.readFileSync(ctx);

const parsedOptions = JSON.parse(serverOptions);

let middleware = Object.keys(parsedOptions.middleware);
let invocations = [];

middleware.forEach((m) => {
  const base = parsedOptions.middleware[m];
  if (base.isRoute) {
    invocations.push(`"${base.mountPath}", ${base.value}`);
  } else if (base.isFunction) {
    invocations.push(`${base.value}(${base.options ? base.options : ``})`);
  }
});

function resolveMiddleware(app) {
  middleware.forEach((m) => {
    const base = parsedOptions.middleware[m];
    if (base.isRoute) {
      invocations.push(`"${base.mountPath}", ${base.value}`);
    } else if (base.isFunction) {
      const value = require(`${process.cwd()}/node_modules/${base.pkg}`);
      if (value === "express") {
        app.use(value.json());
        app.use(value.urlencoded({ extended: true }));
      } else {
        console.log(`app.use(value(${base.options}))`);
        app.use(value(base.options));
      }
    }
  });
}

console.log(invocations);

module.exports = {
  resolveMiddleware,
};
