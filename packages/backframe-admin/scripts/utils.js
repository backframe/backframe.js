const fs = require("fs");
const path = require("path");
const express = require("express");
const { createServer } = require("vite");
const adminRouter = require("../server/router");

async function ssr(app) {
  let vite;
  const root = (...s) => path.resolve(__dirname, "..", ...s);

  if (process.env.NODE_ENV === "development") {
    vite = await createServer({
      server: {
        middlewareMode: true,
        watch: {
          usePolling: true,
          interval: 100,
        },
      },
      appType: "custom",
    });

    app.use(vite.middlewares);
  } else {
    app.use("/static", express.static(root("dist/client")));
  }

  app.use("/__admin", adminRouter);
  app.use("/admin", async (req, res, next) => {
    const url = req.path;
    let template, render;

    try {
      if (process.env.NODE_ENV === "development") {
        template = fs.readFileSync(root("index.html"), "utf-8");
        template = await vite.transformIndexHtml(url, template);
        render = (await vite.ssrLoadModule("/src/entry-server.tsx")).render;
      } else {
        template = fs.readFileSync(root("dist/client/index.html"), "utf-8");
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        render = (
          await import(`file://${root("./dist/server/entry-server.js")}`)
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
}

module.exports = { ssr };
