const express = require("express");
const session = require("express-session");

const authRouter = require("./routes/auth");
const booksRouter = require("./routes/books");

const app = express();
const PORT = 8080;

// Middlewares pour lire le JSON et les formulaires
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuration des sessions
app.use(
  session({
    secret: "mon_secret_super_securise",
    resave: false,
    saveUninitialized: false,
  })
);

// On branche nos deux routers
app.use("/auth", authRouter);
app.use("/books", booksRouter);

app.listen(PORT, () => {
  console.log(`Serveur lancé sur le port ${PORT}`);
});