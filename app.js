const path = require('path');

const express = require('express');

const { get404 } = require('./controllers/errorController');

// Init
const app = express();

// Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Static
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use(get404);

module.exports = app;
