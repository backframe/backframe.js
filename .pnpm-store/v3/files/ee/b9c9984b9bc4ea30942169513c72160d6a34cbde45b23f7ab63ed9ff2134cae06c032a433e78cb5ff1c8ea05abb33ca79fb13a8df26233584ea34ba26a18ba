"use strict";
var import_maskSchema = require("../maskSchema");
test("maskSchema", () => {
  const schema = `datasource db {
    url = "mysql:secret-db"
  }`;
  expect((0, import_maskSchema.maskSchema)(schema)).toMatchInlineSnapshot(`
        "datasource db {
            url = \\"***\\"
          }"
    `);
  const schema2 = `datasource db {
    provider = "mysql"
    url = env("SOME_ENV")
  }`;
  expect((0, import_maskSchema.maskSchema)(schema2)).toMatchInlineSnapshot(`
    "datasource db {
        provider = \\"mysql\\"
        url = \\"***\\"
      }"
  `);
});
