import { Application, Request, Response, NextFunction } from 'express';

const path = require('path');

const express = require('express');

const { handleAppErrors } = require('./controllers/errorController');
const productRoutes = require('./routes/productRoute');
const authRoutes = require('./routes/authRoute');
const cartRoutes = require('./routes/cartRoute');

// Init
const app: Application = express();

// Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Static
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/v1/products', productRoutes);
app.use('/api/v1', authRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use(handleAppErrors);

module.exports = app;

export {};
