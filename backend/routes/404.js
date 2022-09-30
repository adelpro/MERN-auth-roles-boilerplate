const express = require("express");
const router = express.Router();
const path = require("path");

router.get("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    return res.sendFile(path.join(__dirname, "..", "views", "404.html"));
  }
  if (req.accepts("json")) {
    return res.json({ message: "404 page not found" });
  }

  res.type("txt").send("404 page not found");
});
module.exports = router;
