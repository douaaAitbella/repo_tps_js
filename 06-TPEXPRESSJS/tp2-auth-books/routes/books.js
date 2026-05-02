const express = require("express");
const { ensureAuth } = require("../middleware/auth");

const router = express.Router();

const books = [
  { title: "Clean Code", author: "Robert Martin" },
  { title: "Node.js Guide", author: "John Doe" },
  { title: "MongoDB Basics", author: "Jane Smith" }
];

router.get("/", ensureAuth, (req, res) => {
  res.render("books", { books });
});

module.exports = router;