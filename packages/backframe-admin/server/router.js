/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const express = require("express");
const router = express.Router();

router.get("/users", (req, res) => {
  if (!req.headers["user"]) {
    return res.status(401).json({ msg: "Unauthorized" });
  }
  return res.status(200).json({ users: ["User 1", "User 2", "User 3"] });
});

module.exports = router;
