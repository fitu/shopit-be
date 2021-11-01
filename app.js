const path = require('path');

const express = require('express');

const { handleAppErrors } = require('./controllers/errorController');
const productRoutes = require('./routes/productRoute');
const authRoutes = require('./routes/authRoute');

// Init
const app = express();

// Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Static
app.use(express.static(path.join(__dirname, 'public')));

// Routess
app.use('/api/v1/products', productRoutes);
app.use('/api/v1', authRoutes);
app.use(handleAppErrors);

module.exports = app;
