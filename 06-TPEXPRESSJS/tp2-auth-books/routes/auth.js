const express = require("express");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const User = require("../models/User");

const router = express.Router();

// REGISTER
router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", async (req, res) => {
  const hashed = await bcrypt.hash(req.body.password, 10);

  await User.create({
    username: req.body.username,
    password: hashed
  });

  res.redirect("/login");
});

// LOGIN
router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login",
  passport.authenticate("local", {
    successRedirect: "/books",
    failureRedirect: "/login"
  })
);

//  LOGOUT CORRIGÉ
router.get("/logout", (req, res, next) => {
  req.logout(function(err) {
    if (err) return next(err);

    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      res.redirect("/login");
    });
  });
});

module.exports = router;