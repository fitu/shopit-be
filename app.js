const path = require('path');

const express = require('express');

const { handleAppErrors } = require('./controllers/errorController');
const productRoutes = require('./routes/productRoute');

// Init
const app = express();

// Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Static
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/v1/products', productRoutes);
app.use(handleAppErrors);

module.exports = app;
