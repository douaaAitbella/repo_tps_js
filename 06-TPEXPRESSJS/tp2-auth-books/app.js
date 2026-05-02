const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const flash = require("connect-flash");

const app = express();

// MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/tp2_auth");

// Passport config
require("./config/passport")(passport);

// Middlewares
app.use(express.urlencoded({ extended: false }));

app.use(session({
  secret: "secret",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Pug
app.set("view engine", "pug");

// Routes
app.use("/", require("./routes/auth"));
app.use("/books", require("./routes/books"));

// Home redirect
app.get("/", (req, res) => {
  res.redirect("/login");
});

app.listen(3000, () => console.log("Server started on port 3000"));