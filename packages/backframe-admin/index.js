/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs");
const path = require("path");
const express = require("express");
const { createServer } = require("vite");
const { definePlugin } = require("@backframe/core");

const p = definePlugin();

p.beforeServerStart = async (cfg) => {
  process.env.BF_DEBUG && console.log("beforeServerStart called");
  let vite;
  const app = cfg.server._app;
  const here = (...s) => path.resolve(__dirname, ...s);

  if (process.env.NODE_ENV === "development") {
    vite = await createServer({
      server: { middlewareMode: true },
      appType: "custom",
    });

    app.use(vite.middlewares);
  } else {
    app.use("/admin", express.static(path.resolve(__dirname, "dist/client")));
  }

  app.use("/admin", async (req, res, next) => {
    const url = req.originalUrl;
    let template, render;

    try {
      if (process.env.NODE_ENV === "development") {
        template = fs.readFileSync(path.resolve("./index.html"), "utf-8");
        template = await vite.transformIndexHtml(url, template);
        render = (await vite.ssrLoadModule("/src/entry-server.tsx")).render;
      } else {
        template = fs.readFileSync(here("dist/client/index.html"), "utf-8");
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        render = (
          await import(`file://${here("./dist/server/entry-server.js")}`)
        ).render;
      }

      const appHtml = await render({ path: url });
      const html = template.replace("<!--ssr-outlet-->", appHtml);

      res.statusCode = 200;
      res.setHeader("Content-Type", "text/html").end(html);
    } catch (error) {
      console.log(error);
      vite.ssrFixStacktrace(error);
      next(error);
    }
  });

  return cfg;
};

module.exports = p;
