"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var jestContext_exports = {};
__export(jestContext_exports, {
  jestConsoleContext: () => jestConsoleContext,
  jestContext: () => jestContext,
  jestProcessContext: () => jestProcessContext
});
module.exports = __toCommonJS(jestContext_exports);
var import_execa = __toESM(require("execa"));
var import_fs_jetpack = __toESM(require("fs-jetpack"));
var import_path = __toESM(require("path"));
var import_tempy = __toESM(require("tempy"));
const jestContext = {
  new: function(ctx = {}) {
    const c = ctx;
    beforeEach(() => {
      var _a;
      const originalCwd = process.cwd();
      c.tmpDir = import_tempy.default.directory();
      c.fs = import_fs_jetpack.default.cwd(c.tmpDir);
      c.fixture = (name) => {
        c.fs.copy(import_path.default.join(originalCwd, "src", "__tests__", "fixtures", name), ".", {
          overwrite: true
        });
        c.fs.symlink(import_path.default.join(originalCwd, "..", "client"), import_path.default.join(c.fs.cwd(), "node_modules", "@prisma", "client"));
      };
      c.mocked = (_a = c.mocked) != null ? _a : {
        cwd: process.cwd()
      };
      c.cli = (...input) => {
        return import_execa.default.node(import_path.default.join(originalCwd, "../cli/build/index.js"), input, {
          cwd: c.fs.cwd(),
          stdio: "pipe",
          all: true
        });
      };
      process.chdir(c.tmpDir);
    });
    afterEach(() => {
      process.chdir(c.mocked.cwd);
    });
    return factory(ctx);
  }
};
function factory(ctx) {
  return {
    add(contextContributor) {
      const newCtx = contextContributor(ctx);
      return factory(newCtx);
    },
    assemble() {
      return ctx;
    }
  };
}
__name(factory, "factory");
const jestConsoleContext = /* @__PURE__ */ __name(() => (c) => {
  const ctx = c;
  beforeEach(() => {
    ctx.mocked["console.error"] = jest.spyOn(console, "error").mockImplementation(() => {
    });
    ctx.mocked["console.log"] = jest.spyOn(console, "log").mockImplementation(() => {
    });
    ctx.mocked["console.info"] = jest.spyOn(console, "info").mockImplementation(() => {
    });
    ctx.mocked["console.warn"] = jest.spyOn(console, "warn").mockImplementation(() => {
    });
  });
  afterEach(() => {
    ctx.mocked["console.error"].mockRestore();
    ctx.mocked["console.log"].mockRestore();
    ctx.mocked["console.info"].mockRestore();
    ctx.mocked["console.warn"].mockRestore();
  });
  return ctx;
}, "jestConsoleContext");
const jestProcessContext = /* @__PURE__ */ __name(() => (c) => {
  const ctx = c;
  beforeEach(() => {
    ctx.mocked["process.stderr.write"] = jest.spyOn(process.stderr, "write").mockImplementation((message) => true);
    ctx.mocked["process.stdout.write"] = jest.spyOn(process.stdout, "write").mockImplementation((message) => true);
  });
  afterEach(() => {
    ctx.mocked["process.stderr.write"].mockRestore();
    ctx.mocked["process.stdout.write"].mockRestore();
  });
  return ctx;
}, "jestProcessContext");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  jestConsoleContext,
  jestContext,
  jestProcessContext
});
