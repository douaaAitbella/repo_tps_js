const express = require('express');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/books');

const app = express();

app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/library')
.then(() => console.log("MongoDB connecté"))
.catch(err => console.log(err));

app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);

app.listen(3000, () => {
    console.log("Serveur lancé sur port 3000");
});