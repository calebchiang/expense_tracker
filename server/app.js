const express = require('express');
require('dotenv').config();
const app = express();
const mongoose = require('mongoose');
const port = 3000;
const dbURI = process.env.MONGODB_URL;
const cors = require('cors');

app.use(cors());
app.use(express.json());

mongoose.connect(dbURI)
    .then(() => {
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    })

    .catch((err) => console.error('Error connecting to MongoDB:', err.message));

app.get('/', (req, res) => {
    res.send("Hello World");
});

// Include routes
const authRoutes = require('./src/routes/auth');
app.use('/api/auth', authRoutes);

const plaidRoutes = require('./src/routes/plaid');
app.use('/api/plaid', plaidRoutes);

const transactionRoutes = require('./src/routes/transactions');
app.use('/api/transactions', transactionRoutes);

