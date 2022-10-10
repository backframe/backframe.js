const express = require("express");
const { ssr } = require("./utils");

const app = express();

ssr(app)
  .then(() => {
    const PORT = process.env.PORT || 5173;
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch(console.error);
