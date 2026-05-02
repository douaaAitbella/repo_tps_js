const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');

router.get('/', auth, (req, res) => {
    res.json({
        message: "Bienvenue dans la section Books "
    });
});

module.exports = router;