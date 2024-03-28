const express = require('express');
require('dotenv').config();
const app = express()
const mongoose = require('mongoose');
const port = 3000;
const dbURI = process.env.MONGODB_URL;

mongoose.connect(dbURI)
    .then(() => {
        // Only start the server if the database connects
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    })
    .catch((err) => console.error('Error connecting to MongoDB:', err));
app.get('/', (req, res) => {
    res.send("Hello World");
})

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);