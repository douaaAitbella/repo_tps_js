const express = require("express");
const router = express.Router();

// Route POST localhost:8080/auth/login
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Vérification simple : admin / admin
  if (username === "admin" && password === "admin") {
    req.session.isAuthenticated = true; // On marque la session
    res.send("Connexion réussie !");
  } else {
    res.status(401).send("Identifiants incorrects.");
  }
});

// Route GET localhost:8080/auth/logout
router.get("/logout", (req, res) => {
  req.session.destroy(); // On supprime la session
  res.send("Vous êtes déconnecté.");
});

module.exports = router;