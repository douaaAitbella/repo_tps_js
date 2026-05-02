const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET_KEY = "monsecretkey";


// Inscription
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Hasher mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            username,
            email,
            password: hashedPassword
        });

        await user.save();

        res.json({ message: "Utilisateur créé avec succès" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Connexion
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user)
            return res.status(400).json({ message: "Utilisateur introuvable" });

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch)
            return res.status(400).json({ message: "Mot de passe incorrect" });

        // Générer token
        const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: '1h' });

        res.json({ token });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;