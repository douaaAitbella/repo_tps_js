const express = require("express");
const router = express.Router();

// Liste de livres stockée en mémoire
let books = [
  { id: 1, title: "Harry Potter", author: "J.K. Rowling" },
  { id: 2, title: "Le Seigneur des Anneaux", author: "Tolkien" },
];

// Middleware de protection : vérifie si l'utilisateur est connecté
function isAuthenticated(req, res, next) {
  if (req.session.isAuthenticated) {
    next(); // Connecté → on laisse passer
  } else {
    res.status(401).send("Accès refusé. Connectez-vous d'abord sur POST /auth/login");
  }
}

// On applique la protection sur TOUTES les routes de ce router
router.use(isAuthenticated);

// GET localhost:8080/books liste tous les livres
router.get("/", (req, res) => {
  res.json(books);
});

// POST localhost:8080/books ajoute un livre
router.post("/", (req, res) => {
  const { title, author } = req.body;
  const newBook = { id: books.length + 1, title, author };
  books.push(newBook);
  res.status(201).json(newBook);
});

module.exports = router;
